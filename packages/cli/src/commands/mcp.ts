import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import {
  createRegistryIndex,
  fetchRegistry,
  type Registry,
  type RegistryComponent,
} from '../registry.js';
import { readConfig, resolveComponentBasePath } from '../utils.js';
import { resolveInstallSet, collectPeerDeps } from './add.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getCliVersion(): string {
  try {
    // __dirname is dist/commands/ at runtime; package.json is two levels up
    const pkg = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8')) as {
      version: string;
    };
    return pkg.version;
  } catch {
    return 'unknown';
  }
}

function formatComponentDetail(
  component: RegistryComponent,
  registry: Registry,
): string {
  const registryIndex = createRegistryIndex(registry);
  const { toInstall, autoAdded } = resolveInstallSet([component.name], registryIndex);
  const peerDeps = collectPeerDeps(toInstall, registryIndex);

  const lines: string[] = [
    `${component.name} — ${component.description}`,
    '',
    `Files (${component.files.length}):`,
    ...component.files.map((f) => `  ${f}`),
  ];

  if (autoAdded.length > 0) {
    lines.push('', `Auto-installed component dependencies: ${autoAdded.join(', ')}`);
  }
  if (component.sharedDeps?.length) {
    lines.push(`Shared utilities: ${component.sharedDeps.join(', ')}`);
  }
  if (Object.keys(peerDeps).length > 0) {
    lines.push('', 'Peer dependencies (installed into your Angular project):');
    for (const [pkg, ver] of Object.entries(peerDeps)) {
      lines.push(`  ${pkg}@${ver}`);
    }
  }

  return lines.join('\n');
}

type McpErrorContent = { isError: true; content: [{ type: 'text'; text: string }] };

function requireStrings<T extends string>(
  args: unknown,
  fields: T[],
): { values: Record<T, string> } | McpErrorContent {
  const obj = (args ?? {}) as Record<string, unknown>;
  for (const field of fields) {
    const val = obj[field];
    if (typeof val !== 'string' || val.trim() === '') {
      return {
        isError: true,
        content: [{ type: 'text' as const, text: `Missing or invalid argument: "${field}" must be a non-empty string.` }],
      };
    }
  }
  return { values: Object.fromEntries(fields.map((f) => [f, (obj[f] as string).trim()])) as Record<T, string> };
}

export interface AddComponentToolInput {
  name: string;
  cwd: string;
}

export interface AddComponentToolResult {
  ok: boolean;
  output: string;
  exitCode?: number | null;
  errorMessage?: string;
}

export interface CreateMcpServerOptions {
  registryUrl?: string;
  addComponent?: (
    input: AddComponentToolInput,
  ) => AddComponentToolResult | Promise<AddComponentToolResult>;
}

export function createMcpServer(options: CreateMcpServerOptions = {}): Server {
  const registryUrl = options.registryUrl;

  const addComponent = options.addComponent ?? (({ name: componentName, cwd }: AddComponentToolInput): Promise<AddComponentToolResult> => {
    return new Promise((resolve) => {
      const cliBin = join(__dirname, '../index.js');
      const cliArgs = [cliBin, 'add', componentName, '--yes'];
      if (registryUrl) cliArgs.push('--registry', registryUrl);

      const chunks: string[] = [];
      const child = spawn(process.execPath, cliArgs, { cwd, timeout: 60_000 });

      child.stdout.on('data', (d: Buffer) => chunks.push(d.toString()));
      child.stderr.on('data', (d: Buffer) => chunks.push(d.toString()));

      child.on('error', (err) => {
        resolve({ ok: false, output: chunks.join('').trim(), errorMessage: err.message });
      });

      child.on('close', (code) => {
        const output = chunks.join('').trim();
        resolve(code !== 0 ? { ok: false, output, exitCode: code } : { ok: true, output });
      });
    });
  });

  let cachedRegistry: Registry | null = null;
  const getRegistry = async (): Promise<Registry> => {
    if (!cachedRegistry) cachedRegistry = await fetchRegistry(registryUrl);
    return cachedRegistry;
  };

  const server = new Server(
    { name: 'sanring', version: getCliVersion() },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'list_components',
        description: 'List all available Sanring UI components with their names and descriptions.',
        inputSchema: { type: 'object' as const, properties: {} },
      },
      {
        name: 'search_components',
        description:
          'Search Sanring UI components by name or description. Returns matching components ranked by relevance (name matches first).',
        inputSchema: {
          type: 'object' as const,
          properties: {
            query: { type: 'string', description: 'Search term' },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_component_info',
        description:
          'Get detailed information about a specific Sanring UI component: files, component dependencies that will be auto-installed, and required peer dependencies.',
        inputSchema: {
          type: 'object' as const,
          properties: {
            name: {
              type: 'string',
              description: "Component name (e.g. 'button', 'dialog', 'accordion')",
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'plan_component_install',
        description:
          'Preview what would happen if you added a Sanring UI component: which files would be written, which component dependencies would be auto-installed, and which peer packages would need to be installed. Does not modify the project. Pass "cwd" to check against the actual project — files that already exist there are marked and would be skipped (not overwritten) by add_component.',
        inputSchema: {
          type: 'object' as const,
          properties: {
            name: {
              type: 'string',
              description: "Component name to preview (e.g. 'button', 'dialog')",
            },
            cwd: {
              type: 'string',
              description:
                'Optional. Absolute path to the Angular project root (the directory containing angular.json). When given, each file is checked against the project so the preview matches what add_component would actually do.',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'add_component',
        description:
          'Add a Sanring UI component to an Angular project: writes the component source files, installs its peer dependencies via the project package manager, and pulls in any component dependencies automatically. Existing files are left untouched and skipped, never overwritten — this tool cannot force-overwrite. Call plan_component_install first (with the same "cwd") to preview exactly which files would be written vs. skipped.',
        inputSchema: {
          type: 'object' as const,
          properties: {
            name: { type: 'string', description: 'Component name to install' },
            cwd: {
              type: 'string',
              description:
                'Absolute path to the Angular project root (the directory containing angular.json)',
            },
          },
          required: ['name', 'cwd'],
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'list_components': {
        const registry = await getRegistry();
        const lines = registry.components
          .map((c) => `  ${c.name.padEnd(24)} ${c.description}`)
          .join('\n');
        return {
          content: [
            {
              type: 'text' as const,
              text: `Sanring UI — ${registry.components.length} components available:\n\n${lines}`,
            },
          ],
        };
      }

      case 'search_components': {
        const validated = requireStrings(args, ['query']);
        if ('isError' in validated) return validated;
        const { query } = validated.values;
        const registry = await getRegistry();
        const q = query.toLowerCase();
        const nameMatches = registry.components.filter((c) => c.name.toLowerCase().includes(q));
        const descMatches = registry.components.filter(
          (c) =>
            !c.name.toLowerCase().includes(q) && c.description.toLowerCase().includes(q),
        );
        const matches = [...nameMatches, ...descMatches];

        if (matches.length === 0) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `No components matching "${query}". Run list_components to see all available components.`,
              },
            ],
          };
        }

        const lines = matches
          .map((c) => `  ${c.name.padEnd(24)} ${c.description}`)
          .join('\n');
        return {
          content: [
            {
              type: 'text' as const,
              text: `Found ${matches.length} component(s) matching "${query}":\n\n${lines}`,
            },
          ],
        };
      }

      case 'get_component_info': {
        const validated = requireStrings(args, ['name']);
        if ('isError' in validated) return validated;
        const { name: componentName } = validated.values;
        const registry = await getRegistry();
        const component = registry.components.find((c) => c.name === componentName);

        if (!component) {
          const available = registry.components.map((c) => c.name).join(', ');
          return {
            isError: true,
            content: [
              {
                type: 'text' as const,
                text: `Component "${componentName}" not found.\n\nAvailable: ${available}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text' as const,
              text: formatComponentDetail(component, registry),
            },
          ],
        };
      }

      case 'plan_component_install': {
        const validated = requireStrings(args, ['name']);
        if ('isError' in validated) return validated;
        const { name: componentName } = validated.values;

        const rawCwd = (args as Record<string, unknown> | undefined)?.['cwd'];
        let cwd: string | undefined;
        if (rawCwd !== undefined) {
          if (typeof rawCwd !== 'string' || rawCwd.trim() === '') {
            return {
              isError: true,
              content: [{ type: 'text' as const, text: 'Missing or invalid argument: "cwd" must be a non-empty string.' }],
            };
          }
          if (!isAbsolute(rawCwd)) {
            return {
              isError: true,
              content: [{ type: 'text' as const, text: `"cwd" must be an absolute path, got "${rawCwd}".` }],
            };
          }
          cwd = rawCwd;
        }

        const registry = await getRegistry();
        const component = registry.components.find((c) => c.name === componentName);

        if (!component) {
          const available = registry.components.map((c) => c.name).join(', ');
          return {
            isError: true,
            content: [{ type: 'text' as const, text: `Component "${componentName}" not found.\n\nAvailable: ${available}` }],
          };
        }

        const registryIndex = createRegistryIndex(registry);
        const { toInstall, autoAdded } = resolveInstallSet([componentName], registryIndex);
        const peerDeps = collectPeerDeps(toInstall, registryIndex);

        const lines: string[] = [`Plan for: sanring add ${componentName}`, ''];

        if (cwd) {
          const config = readConfig(cwd);
          const componentBasePath = resolveComponentBasePath(cwd, undefined, config);
          const sharedDestDir = config?.sharedPath
            ? resolve(cwd, config.sharedPath)
            : join(componentBasePath, 'shared');

          const sharedNames = new Set(toInstall.flatMap((c) => c.sharedDeps ?? []));
          const fileLines: string[] = [];
          let newCount = 0;
          let skipCount = 0;

          for (const depName of sharedNames) {
            const shared = registryIndex.sharedByName.get(depName);
            if (!shared) continue;
            const fileName = shared.file.split('/').pop()!;
            const exists = existsSync(join(sharedDestDir, fileName));
            fileLines.push(`  ${exists ? '~' : '+'} shared/${fileName}${exists ? ' (exists, would be skipped)' : ' (new)'}`);
            if (exists) skipCount++;
            else newCount++;
          }

          for (const c of toInstall) {
            const destDir = join(componentBasePath, c.name);
            for (const file of c.files) {
              const fileName = file.split('/').pop()!;
              const exists = existsSync(join(destDir, fileName));
              fileLines.push(`  ${exists ? '~' : '+'} ${c.name}/${fileName}${exists ? ' (exists, would be skipped)' : ' (new)'}`);
              if (exists) skipCount++;
              else newCount++;
            }
          }

          lines.push(
            `Files (${newCount} new, ${skipCount} already exist and would be skipped):`,
            ...fileLines,
          );
        } else {
          const allFiles = toInstall.flatMap((c) => c.files);
          lines.push(`Files to write (${allFiles.length}):`, ...allFiles.map((f) => `  ${f}`));
          lines.push('', 'Pass "cwd" to check which of these already exist in your project.');
        }

        if (autoAdded.length > 0) {
          lines.push('', `Component dependencies (auto-installed): ${autoAdded.join(', ')}`);
        }
        if (Object.keys(peerDeps).length > 0) {
          lines.push('', 'Peer packages to install:');
          for (const [pkg, ver] of Object.entries(peerDeps)) {
            lines.push(`  ${pkg}@${ver}`);
          }
        }
        lines.push('', 'Run add_component to apply.');

        return { content: [{ type: 'text' as const, text: lines.join('\n') }] };
      }

      case 'add_component': {
        const validated = requireStrings(args, ['name', 'cwd']);
        if ('isError' in validated) return validated;
        const { name: componentName, cwd } = validated.values;

        if (!isAbsolute(cwd)) {
          return {
            isError: true,
            content: [
              {
                type: 'text' as const,
                text: `"cwd" must be an absolute path, got "${cwd}".`,
              },
            ],
          };
        }

        if (!existsSync(join(cwd, 'angular.json'))) {
          return {
            isError: true,
            content: [
              {
                type: 'text' as const,
                text: `"${cwd}" does not appear to be an Angular project root (angular.json not found).`,
              },
            ],
          };
        }

        const result = await addComponent({ name: componentName, cwd });

        if (result.errorMessage) {
          return {
            isError: true,
            content: [
              {
                type: 'text' as const,
                text: `Failed to run sanring add: ${result.errorMessage}`,
              },
            ],
          };
        }

        if (!result.ok) {
          return {
            isError: true,
            content: [
              {
                type: 'text' as const,
                text:
                  `sanring add "${componentName}" failed ` +
                  `(exit ${result.exitCode ?? 'unknown'}):\n\n${result.output}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text' as const,
              text: `Successfully added "${componentName}" to the project.\n\n${result.output}`,
            },
          ],
        };
      }

      default:
        return {
          isError: true,
          content: [{ type: 'text' as const, text: `Unknown tool: ${name}` }],
        };
    }
  });

  return server;
}

async function startMcpServer(registryUrl?: string): Promise<void> {
  const server = createMcpServer({ registryUrl });
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

export const mcpCommand = new Command('mcp')
  .description(
    'Start the MCP server for AI agent integration (Claude Code, Cursor, Windsurf)',
  )
  .option('--registry <url>', 'custom registry URL or local path')
  .action(async (options: { registry?: string }) => {
    await startMcpServer(options.registry);
  });
