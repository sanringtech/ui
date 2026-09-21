import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Registry } from '../registry.js';

export interface RegistryFixtureContent {
  utils?: string;
  utilsPeerDependencies?: Record<string, string>;
  theme?: string;
  /** Theme preset override partials, keyed by preset name (e.g. 'slate' -> shared/theme-presets/slate.css). */
  themePresets?: Record<string, string>;
  widget?: string;
  /** Second file added to the widget component — simulates a registry adding a new file post-install. */
  widgetExtra?: string;
  /** Page-level block installed from `blocks/`, with `widget` as a componentDep when present. */
  block?: string;
}

// Writes a minimal, self-contained registry (registry.json + the files it
// points at) to `dir`, so add/update/init integration tests can point
// `--registry` at a real directory on disk without depending on the actual
// project registry's content or shape.
export function writeRegistryFixture(dir: string, content: RegistryFixtureContent): void {
  mkdirSync(join(dir, 'shared'), { recursive: true });
  mkdirSync(join(dir, 'components', 'widget'), { recursive: true });

  const shared: Registry['shared'] = [];
  if (content.utils !== undefined) {
    writeFileSync(join(dir, 'shared', 'utils.ts'), content.utils, 'utf-8');
    shared.push({
      name: 'utils',
      description: 'fixture utils',
      file: 'shared/utils.ts',
      peerDependencies: content.utilsPeerDependencies,
    });
  }
  if (content.theme !== undefined) {
    writeFileSync(join(dir, 'shared', 'theme.css'), content.theme, 'utf-8');
    shared.push({ name: 'theme', description: 'fixture theme', file: 'shared/theme.css' });
  }
  if (content.themePresets !== undefined) {
    mkdirSync(join(dir, 'shared', 'theme-presets'), { recursive: true });
    for (const [name, css] of Object.entries(content.themePresets)) {
      writeFileSync(join(dir, 'shared', 'theme-presets', `${name}.css`), css, 'utf-8');
    }
  }

  const components: Registry['components'] = [];
  if (content.widget !== undefined) {
    writeFileSync(join(dir, 'components', 'widget', 'index.ts'), content.widget, 'utf-8');
    const files = ['widget/index.ts'];
    if (content.widgetExtra !== undefined) {
      writeFileSync(join(dir, 'components', 'widget', 'extra.ts'), content.widgetExtra, 'utf-8');
      files.push('widget/extra.ts');
    }
    components.push({
      name: 'widget',
      description: 'fixture widget',
      files,
      sharedDeps: content.utils !== undefined ? ['utils'] : [],
    });
  }

  const blocks: Registry['blocks'] = [];
  if (content.block !== undefined) {
    mkdirSync(join(dir, 'blocks', 'login'), { recursive: true });
    writeFileSync(join(dir, 'blocks', 'login', 'index.ts'), content.block, 'utf-8');
    blocks.push({
      name: 'login',
      description: 'fixture login block',
      files: ['login/index.ts'],
      componentDeps: content.widget !== undefined ? ['widget'] : [],
    });
  }

  const registry: Registry = { name: 'fixture', shared, components };
  if (blocks.length > 0) registry.blocks = blocks;
  writeFileSync(join(dir, 'registry.json'), JSON.stringify(registry, null, 2), 'utf-8');
}
