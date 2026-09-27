import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { formatComponentSpec, rankRegistryItems, fetchComponentSpecs, type ComponentSpec } from './component-spec.js';

describe('rankRegistryItems', () => {
  const items = [
    { name: 'dialog', description: 'An overlay primitive for modal tasks' },
    { name: 'alert-dialog', description: 'A dialog that requires an explicit choice' },
    { name: 'button', description: 'A clickable button' },
  ];
  const specs = {
    dialog: { name: 'dialog', aliases: ['modal'] },
    'alert-dialog': { name: 'alert-dialog', aliases: ['confirm', 'modal'] },
  };

  it('maps modal to dialog and alert-dialog', () => {
    expect(rankRegistryItems(items, 'modal', specs).map((item) => item.name)).toEqual([
      'dialog',
      'alert-dialog',
    ]);
  });

  it('maps confirm to alert-dialog', () => {
    expect(rankRegistryItems(items, 'confirm', specs)[0]?.name).toBe('alert-dialog');
  });

  it('still ranks an exact name first', () => {
    expect(rankRegistryItems(items, 'dialog', specs)[0]?.name).toBe('dialog');
  });
});

describe('formatComponentSpec', () => {
  it('lists anatomy, API, and accessibility', () => {
    const spec: ComponentSpec = {
      name: 'dialog',
      title: 'Dialog',
      description: 'Overlay primitive.',
      anatomy: 'sanring-dialog-content',
      example: '<sanring-dialog-content></sanring-dialog-content>',
      api: [{ property: 'showClose', type: 'boolean', defaultValue: 'true', description: 'Show X' }],
      accessibility: ["role='dialog'"],
    };
    const text = formatComponentSpec(spec);
    expect(text).toContain('sanring-dialog-content');
    expect(text).toContain('showClose');
    expect(text).toContain("role='dialog'");
    expect(text).toContain('Do not invent APIs');
  });
});

describe('fetchComponentSpecs', () => {
  let dir: string;

  afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
  });

  it('returns an empty catalog when specs.json is missing', async () => {
    dir = mkdtempSync(join(tmpdir(), 'sanring-specs-missing-'));
    writeFileSync(join(dir, 'registry.json'), '{"name":"x","shared":[],"components":[]}', 'utf-8');
    expect(await fetchComponentSpecs(dir)).toEqual({});
  });

  it('reads specs.json next to the registry', async () => {
    dir = mkdtempSync(join(tmpdir(), 'sanring-specs-present-'));
    writeFileSync(join(dir, 'registry.json'), '{"name":"x","shared":[],"components":[]}', 'utf-8');
    writeFileSync(join(dir, 'specs.json'), '{"dialog":{"name":"dialog","aliases":["modal"]}}', 'utf-8');
    expect(await fetchComponentSpecs(dir)).toEqual({ dialog: { name: 'dialog', aliases: ['modal'] } });
  });
});
