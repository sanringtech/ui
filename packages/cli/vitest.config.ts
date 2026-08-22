import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // picocolors treats any truthy `CI` env var as color support (it can't tell
    // GitHub Actions' log viewer from a dumb pipe), so command output carries
    // ANSI codes in CI but not locally — silently breaking literal-text
    // assertions (e.g. `.includes('Installed (1)')`) only in CI. Force colors
    // off so command output — and these tests — behave the same everywhere.
    env: { NO_COLOR: '1' },
    include: ['src/**/*.test.ts', 'schematics/**/*.test.ts'],
    // Many command tests call process.chdir() to point commands at a temp
    // project dir. process.chdir() is process-wide, not per-worker-thread,
    // so under the default `threads` pool concurrently-running test files
    // race on the real cwd — e.g. registry.test.ts's cwd-relative fixture
    // reads intermittently fail when another file has chdir'd elsewhere at
    // the same moment. `forks` runs each file in its own OS process, giving
    // each an independent cwd and eliminating the race.
    pool: 'forks',
  },
});
