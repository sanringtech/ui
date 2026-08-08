import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { spawnSync } from 'node:child_process';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ngAdd } from './index.js';

vi.mock('node:child_process', () => ({
  spawnSync: vi.fn(),
}));

const spawnSyncMock = vi.mocked(spawnSync);

function fakeContext(): SchematicContext {
  return { logger: { info: vi.fn() } } as unknown as SchematicContext;
}

function run(rule: Rule, context: SchematicContext) {
  return (rule as (tree: Tree, context: SchematicContext) => void)({} as Tree, context);
}

describe('ngAdd schematic', () => {
  beforeEach(() => {
    spawnSyncMock.mockReset();
    spawnSyncMock.mockReturnValue({ status: 0 } as ReturnType<typeof spawnSync>);
  });

  it('spawns the built CLI entry with just `init` by default', () => {
    run(ngAdd({}), fakeContext());

    expect(spawnSyncMock).toHaveBeenCalledTimes(1);
    const [command, args, options] = spawnSyncMock.mock.calls[0];
    expect(command).toBe(process.execPath);
    expect(args?.[0]).toMatch(/index\.js$/);
    expect(args?.slice(1)).toEqual(['init']);
    expect(options).toMatchObject({ stdio: 'inherit', cwd: process.cwd() });
  });

  it('translates options into sanring init flags', () => {
    run(
      ngAdd({
        path: 'src/app/ui',
        skipConfirmation: true,
        force: true,
        registry: 'https://example.com/registry.json',
      }),
      fakeContext(),
    );

    const [, args] = spawnSyncMock.mock.calls[0];
    expect(args?.slice(1)).toEqual([
      'init',
      '--path',
      'src/app/ui',
      '--yes',
      '--force',
      '--registry',
      'https://example.com/registry.json',
    ]);
  });

  it('throws when sanring init exits with a non-zero status', () => {
    spawnSyncMock.mockReturnValue({ status: 1 } as ReturnType<typeof spawnSync>);

    expect(() => run(ngAdd({}), fakeContext())).toThrow(/sanring init failed/);
  });

  it('logs progress via the schematic context logger', () => {
    const context = fakeContext();
    run(ngAdd({}), context);

    expect(context.logger.info).toHaveBeenCalledWith(expect.stringContaining('sanring init'));
  });
});
