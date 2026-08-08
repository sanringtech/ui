import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { writeRegistryFixture } from '../__tests__/registry-fixture.js';
import { createMcpServer, type AddComponentToolInput } from './mcp.js';

interface TextToolResult {
  content: Array<{ type: string; text?: string }>;
}

function hasTextToolContent(result: unknown): result is TextToolResult {
  return (
    typeof result === 'object' &&
    result !== null &&
    'content' in result &&
    Array.isArray((result as { content?: unknown }).content)
  );
}

function textContent(result: unknown): string {
  if (!hasTextToolContent(result)) return '';
  return result.content
    .map((item) => (item.type === 'text' ? item.text : ''))
    .filter(Boolean)
    .join('\n');
}

describe('mcp server', () => {
  let registryDir: string;
  let projectDir: string;
  let client: Client | undefined;
  let clientTransport: InMemoryTransport | undefined;
  let serverTransport: InMemoryTransport | undefined;

  beforeEach(async () => {
    registryDir = mkdtempSync(join(tmpdir(), 'sanring-cli-mcp-registry-'));
    projectDir = mkdtempSync(join(tmpdir(), 'sanring-cli-mcp-project-'));
    writeFileSync(join(projectDir, 'angular.json'), '{}', 'utf-8');
    writeRegistryFixture(registryDir, {
      utils: 'export function cn() {}\n',
      utilsPeerDependencies: { clsx: '^2.0.0' },
      widget: 'export const widget = 1;\n',
    });
  });

  afterEach(async () => {
    await client?.close();
    await clientTransport?.close();
    await serverTransport?.close();
    rmSync(projectDir, { recursive: true, force: true });
    rmSync(registryDir, { recursive: true, force: true });
  });

  async function connect(addComponent?: (input: AddComponentToolInput) => Promise<{
    ok: boolean;
    output: string;
  }>): Promise<Client> {
    const server = createMcpServer({ registryUrl: registryDir, addComponent });
    client = new Client(
      { name: 'sanring-cli-mcp-test', version: '0.0.0' },
      { capabilities: {} },
    );
    [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
    return client;
  }

  it('lists the tools exposed to AI agents', async () => {
    const testClient = await connect();

    const result = await testClient.listTools();

    expect(result.tools.map((tool) => tool.name)).toEqual([
      'list_components',
      'search_components',
      'get_component_info',
      'plan_component_install',
      'add_component',
    ]);
  });

  it('searches and describes components through MCP calls', async () => {
    const testClient = await connect();

    const searchResult = await testClient.callTool({
      name: 'search_components',
      arguments: { query: 'fixture' },
    });
    const detailResult = await testClient.callTool({
      name: 'get_component_info',
      arguments: { name: 'widget' },
    });

    expect(textContent(searchResult)).toContain('widget');
    expect(textContent(detailResult)).toContain('Files (1):');
    expect(textContent(detailResult)).toContain('widget/index.ts');
    expect(textContent(detailResult)).toContain('Shared utilities: utils');
    expect(textContent(detailResult)).toContain('clsx@^2.0.0');
  });

  it('plan_component_install returns files and peer deps without modifying project', async () => {
    const testClient = await connect();

    const result = await testClient.callTool({
      name: 'plan_component_install',
      arguments: { name: 'widget' },
    });

    const text = textContent(result);
    expect(text).toContain('Plan for: sanring add widget');
    expect(text).toContain('widget/index.ts');
    expect(text).toContain('clsx@^2.0.0');
    expect(text).toContain('Run add_component to apply.');
    expect((result as { isError?: boolean }).isError).toBeUndefined();
  });

  it('plan_component_install marks existing files as skipped when cwd is given', async () => {
    const testClient = await connect();

    // widget/index.ts already exists in the project -> should be reported as "exists"
    const existingDir = join(projectDir, 'src/app/components/ui/widget');
    mkdirSync(existingDir, { recursive: true });
    writeFileSync(join(existingDir, 'index.ts'), '// already here\n', 'utf-8');

    const result = await testClient.callTool({
      name: 'plan_component_install',
      arguments: { name: 'widget', cwd: projectDir },
    });

    const text = textContent(result);
    expect(text).toContain('1 new, 1 already exist');
    expect(text).toContain('widget/index.ts (exists, would be skipped)');
    expect(text).toContain('shared/utils.ts (new)');
    expect((result as { isError?: boolean }).isError).toBeUndefined();
  });

  it('plan_component_install rejects a relative cwd', async () => {
    const testClient = await connect();

    const result = await testClient.callTool({
      name: 'plan_component_install',
      arguments: { name: 'widget', cwd: 'relative/path' },
    });

    expect((result as { isError?: boolean }).isError).toBe(true);
    expect(textContent(result)).toContain('must be an absolute path');
  });

  it('returns isError when a component name is not found', async () => {
    const testClient = await connect();

    const detailResult = await testClient.callTool({
      name: 'get_component_info',
      arguments: { name: 'does-not-exist' },
    });
    const planResult = await testClient.callTool({
      name: 'plan_component_install',
      arguments: { name: 'does-not-exist' },
    });

    for (const result of [detailResult, planResult]) {
      expect((result as { isError?: boolean }).isError).toBe(true);
      expect(textContent(result)).toContain('not found');
    }
  });

  it('returns isError for missing or empty string arguments', async () => {
    const testClient = await connect();

    const missingQuery = await testClient.callTool({ name: 'search_components', arguments: {} });
    const emptyQuery = await testClient.callTool({ name: 'search_components', arguments: { query: '  ' } });
    const missingName = await testClient.callTool({ name: 'get_component_info', arguments: {} });
    const missingCwd = await testClient.callTool({ name: 'add_component', arguments: { name: 'widget' } });

    for (const result of [missingQuery, emptyQuery, missingName, missingCwd]) {
      expect((result as { isError?: boolean }).isError).toBe(true);
      expect(textContent(result)).toContain('must be a non-empty string');
    }
  });

  it('returns isError when add_component cwd is not an absolute path', async () => {
    const testClient = await connect();

    const result = await testClient.callTool({
      name: 'add_component',
      arguments: { name: 'widget', cwd: 'relative/path' },
    });

    expect((result as { isError?: boolean }).isError).toBe(true);
    expect(textContent(result)).toContain('must be an absolute path');
  });

  it('runs add_component through the MCP tool boundary', async () => {
    const calls: AddComponentToolInput[] = [];
    const testClient = await connect(async (input) => {
      calls.push(input);
      writeFileSync(join(input.cwd, 'sanring-added.txt'), input.name, 'utf-8');
      return { ok: true, output: 'installed widget' };
    });

    const result = await testClient.callTool({
      name: 'add_component',
      arguments: { name: 'widget', cwd: projectDir },
    });

    expect(calls).toEqual([{ name: 'widget', cwd: projectDir }]);
    expect(existsSync(join(projectDir, 'sanring-added.txt'))).toBe(true);
    expect(textContent(result)).toContain('Successfully added "widget"');
    expect(textContent(result)).toContain('installed widget');
  });
});
