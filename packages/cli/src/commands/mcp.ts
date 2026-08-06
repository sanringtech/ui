import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import { createRegistryIndex, fetchRegistry, type RegistryComponent } from '../registry.js';
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
  allComponents: RegistryComponent[],
): string {
  const registryIndex = createRegistryIndex({
    name: '',
    shared: [],
    components: allComponents,
  });
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

async function startMcpServer(registryUrl?: string): Promise<void> {
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
        name: 'add_component',
        description:
          'Add a Sanring UI component to an Angular project. Copies component source files into the project, installs peer dependencies, and handles component dependencies automatically.',
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
        const registry = await fetchRegistry(registryUrl);
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
        const { query } = args as { query: string };
        const registry = await fetchRegistry(registryUrl);
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
        const { name: componentName } = args as { name: string };
        const registry = await fetchRegistry(registryUrl);
        const component = registry.components.find((c) => c.name === componentName);

        if (!component) {
          const available = registry.components.map((c) => c.name).join(', ');
          return {
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
              text: formatComponentDetail(component, registry.components),
            },
          ],
        };
      }

      case 'add_component': {
        const { name: componentName, cwd } = args as { name: string; cwd: string };
        const cliBin = join(__dirname, 'index.js');

        const result = spawnSync(process.execPath, [cliBin, 'add', componentName, '--yes'], {
          cwd,
          encoding: 'utf-8',
          timeout: 60_000,
        });

        if (result.error) {
          return {
            isError: true,
            content: [
              {
                type: 'text' as const,
                text: `Failed to run sanring add: ${result.error.message}`,
              },
            ],
          };
        }

        const output = [result.stdout, result.stderr]
          .filter(Boolean)
          .join('\n')
          .trim();

        if (result.status !== 0) {
          return {
            isError: true,
            content: [
              {
                type: 'text' as const,
                text: `sanring add "${componentName}" failed (exit ${result.status ?? 'unknown'}):\n\n${output}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text' as const,
              text: `Successfully added "${componentName}" to the project.\n\n${output}`,
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
