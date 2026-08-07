import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { execSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { writeRegistryFixture } from '../__tests__/registry-fixture.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliRoot = join(__dirname, '../..');
const distIndex = join(cliRoot, 'dist/index.js');

describe('mcp server e2e (stdio)', () => {
  let registryDir: string;
  let projectDir: string;
  let client: Client | undefined;
  let transport: StdioClientTransport | undefined;

  beforeAll(() => {
    execSync('npm run build', { cwd: cliRoot, stdio: 'pipe' });
  }, 60_000);

  beforeEach(() => {
    registryDir = mkdtempSync(join(tmpdir(), 'sanring-mcp-e2e-reg-'));
    projectDir = mkdtempSync(join(tmpdir(), 'sanring-mcp-e2e-proj-'));
    writeFileSync(join(projectDir, 'angular.json'), '{}', 'utf-8');
    writeRegistryFixture(registryDir, {
      utils: 'export function cn() {}\n',
      widget: 'export const widget = 1;\n',
    });
  });

  afterEach(async () => {
    await client?.close();
    await transport?.close();
    rmSync(projectDir, { recursive: true, force: true });
    rmSync(registryDir, { recursive: true, force: true });
  });

  it('add_component writes component files into the Angular project', async () => {
    transport = new StdioClientTransport({
      command: process.execPath,
      args: [distIndex, 'mcp', '--registry', registryDir],
    });
    client = new Client({ name: 'sanring-e2e', version: '0.0.0' }, { capabilities: {} });
    await client.connect(transport);

    const result = await client.callTool({
      name: 'add_component',
      arguments: { name: 'widget', cwd: projectDir },
    });

    const text = (result.content as Array<{ type: string; text?: string }>)
      .filter((c) => c.type === 'text')
      .map((c) => c.text ?? '')
      .join('\n');

    expect(text).toContain('Successfully added "widget"');
    expect(existsSync(join(projectDir, 'src/app/components/ui/widget/index.ts'))).toBe(true);
  });

  it('returns isError when cwd has no angular.json', async () => {
    transport = new StdioClientTransport({
      command: process.execPath,
      args: [distIndex, 'mcp', '--registry', registryDir],
    });
    client = new Client({ name: 'sanring-e2e', version: '0.0.0' }, { capabilities: {} });
    await client.connect(transport);

    const result = await client.callTool({
      name: 'add_component',
      arguments: { name: 'widget', cwd: '/tmp/not-an-angular-project' },
    });

    expect((result as { isError?: boolean }).isError).toBe(true);
    const text = (result.content as Array<{ type: string; text?: string }>)
      .filter((c) => c.type === 'text')
      .map((c) => c.text ?? '')
      .join('\n');
    expect(text).toContain('angular.json not found');
  });
});
