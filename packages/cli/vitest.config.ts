import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
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
