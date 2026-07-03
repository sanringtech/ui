import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  detectPackageManager,
  fetchFile,
  fetchRegistry,
  installCommand,
} from './registry.js';

// Stubbed once at module scope: vi.stubGlobal calls inside describe() bodies
// all run during Vitest's collection phase (before any test executes), so
// stubbing per-describe would have the last describe's mock silently win for
// every test in the file.
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

describe('detectPackageManager', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'sanring-cli-test-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('detects pnpm from pnpm-lock.yaml', () => {
    writeFileSync(join(dir, 'pnpm-lock.yaml'), '');
    expect(detectPackageManager(dir)).toBe('pnpm');
  });

  it('detects yarn from yarn.lock', () => {
    writeFileSync(join(dir, 'yarn.lock'), '');
    expect(detectPackageManager(dir)).toBe('yarn');
  });

  it('detects bun from bun.lockb', () => {
    writeFileSync(join(dir, 'bun.lockb'), '');
    expect(detectPackageManager(dir)).toBe('bun');
  });

  it('defaults to npm when no lockfile is present', () => {
    expect(detectPackageManager(dir)).toBe('npm');
  });

  it('prefers pnpm over yarn when both lockfiles exist', () => {
    writeFileSync(join(dir, 'pnpm-lock.yaml'), '');
    writeFileSync(join(dir, 'yarn.lock'), '');
    expect(detectPackageManager(dir)).toBe('pnpm');
  });
});

describe('installCommand', () => {
  it('builds the right add command per package manager', () => {
    expect(installCommand('npm', ['clsx@^2.0.0'])).toBe('npm install clsx@^2.0.0');
    expect(installCommand('pnpm', ['clsx@^2.0.0'])).toBe('pnpm add clsx@^2.0.0');
    expect(installCommand('yarn', ['clsx@^2.0.0'])).toBe('yarn add clsx@^2.0.0');
    expect(installCommand('bun', ['clsx@^2.0.0'])).toBe('bun add clsx@^2.0.0');
  });

  it('joins multiple packages with a space', () => {
    expect(installCommand('npm', ['a@1', 'b@2'])).toBe('npm install a@1 b@2');
  });
});

// fetchRegistry / fetchFile source-resolution priority:
//   1. explicit local path   2. explicit URL   3. bundled local registry   4. remote fallback
describe('fetchRegistry source resolution', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('priority 1: reads registry.json from an explicit local directory', async () => {
    const registry = await fetchRegistry('./registry');
    expect(registry.name).toBe('sanring-ui');
    expect(registry.components.length).toBeGreaterThan(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('exits when the explicit local directory has no registry.json', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((() => {
      throw new Error('process.exit called');
    }) as never));
    const dir = mkdtempSync(join(tmpdir(), 'sanring-cli-test-'));
    await expect(fetchRegistry(dir)).rejects.toThrow('process.exit called');
    exitSpy.mockRestore();
    rmSync(dir, { recursive: true, force: true });
  });

  // Note: unlike the local-path branch (which appends `registry.json` to a
  // directory path), the URL branch fetches `source` as-is — the URL must
  // point directly at the registry.json file, mirroring how REMOTE_BASE is
  // used for the version-pinned fallback.
  it('priority 2: fetches registry.json from an explicit URL', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: 'remote-registry', shared: [], components: [] }),
    });
    const registry = await fetchRegistry('https://example.com/registry/registry.json');
    expect(registry.name).toBe('remote-registry');
    expect(fetchMock).toHaveBeenCalledWith('https://example.com/registry/registry.json');
  });

  it('exits when the explicit URL request fails', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 404 });
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((() => {
      throw new Error('process.exit called');
    }) as never));
    await expect(fetchRegistry('https://example.com/registry/registry.json')).rejects.toThrow(
      'process.exit called',
    );
    exitSpy.mockRestore();
  });

  it('priority 3: falls back to the bundled local registry when no source is given', async () => {
    const registry = await fetchRegistry();
    expect(registry.name).toBe('sanring-ui');
    expect(registry.components.length).toBeGreaterThan(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('fetchFile source resolution', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('reads a file from an explicit local directory', async () => {
    const content = await fetchFile('components/button/button.directive.ts', './registry');
    expect(content).toContain('class');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('falls back to the bundled local registry when no source is given', async () => {
    const content = await fetchFile('components/button/button.directive.ts');
    expect(content).toContain('class');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
