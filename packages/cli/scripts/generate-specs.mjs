#!/usr/bin/env node
// Builds registry/specs.json from apps/docs component pages + English copy.
// MCP get_component_spec reads this file; do not hand-edit it.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '../../..');
const DOCS_PAGES = join(REPO_ROOT, 'apps/docs/src/app/pages/components');
const EN_LOCALES = join(REPO_ROOT, 'apps/docs/src/app/i18n/locales/en');
const OUT_PATH = join(REPO_ROOT, 'registry/specs.json');

const ALIASES = {
  'alert-dialog': ['confirm', 'confirmation', 'delete', 'modal'],
  dialog: ['modal', 'overlay'],
  'dropdown-menu': ['dropdown', 'menu'],
  select: ['dropdown'],
  combobox: ['autocomplete', 'typeahead'],
  popover: ['popup', 'flyout'],
  sheet: ['drawer', 'slide-over'],
  toast: ['snackbar', 'notification'],
  tooltip: ['hint'],
  command: ['command palette', 'cmdk'],
  'context-menu': ['right-click', 'right click'],
  'date-picker': ['datepicker'],
  calendar: ['datepicker'],
  'otp-input': ['pin', 'verification code'],
  'file-upload': ['uploader'],
  radio: ['radio group'],
  switch: ['toggle switch'],
  slider: ['range'],
  sortable: ['drag', 'reorder', 'drag list', 'sortable list'],
  'color-picker': ['colour picker', 'hex picker', 'colorpicker'],
  sidebar: ['sidenav'],
  table: ['datagrid', 'data table'],
  transfer: ['shuttle'],
  stepper: ['wizard', 'steps'],
  resizable: ['split pane'],
  'scroll-area': ['scrollbar'],
  skeleton: ['placeholder'],
  spinner: ['loading'],
  tag: ['chip'],
  badge: ['chip'],
  accordion: ['collapse'],
};

function walkTs(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walkTs(path, acc);
    else if (entry.name.endsWith('.ts')) acc.push(path);
  }
  return acc;
}

function readQuoted(source, quoteIndex) {
  const quote = source[quoteIndex];
  let i = quoteIndex + 1;
  let value = '';
  if (quote === '`') {
    while (i < source.length) {
      if (source[i] === '\\' && i + 1 < source.length) {
        value += source[i + 1];
        i += 2;
        continue;
      }
      if (source[i] === '`') return { value, end: i + 1 };
      value += source[i++];
    }
    return null;
  }
  while (i < source.length) {
    if (source[i] === '\\' && i + 1 < source.length) {
      value += source[i + 1];
      i += 2;
      continue;
    }
    if (source[i] === quote) return { value, end: i + 1 };
    value += source[i++];
  }
  return null;
}

function loadTranslations() {
  const map = {};
  for (const file of walkTs(EN_LOCALES)) {
    const source = readFileSync(file, 'utf-8');
    const re = /['"]([^'"]+)['"]\s*:/g;
    let match;
    while ((match = re.exec(source))) {
      let i = match.index + match[0].length;
      while (i < source.length && /\s/.test(source[i])) i++;
      if (source[i] !== "'" && source[i] !== '"' && source[i] !== '`') continue;
      const parsed = readQuoted(source, i);
      if (!parsed) continue;
      map[match[1]] = parsed.value;
      re.lastIndex = parsed.end;
    }
  }
  return map;
}

function extractField(source, field) {
  const re = new RegExp(`\\b${field}\\s*:\\s*`);
  const match = re.exec(source);
  if (!match) return '';
  let i = match.index + match[0].length;
  while (i < source.length && /\s/.test(source[i])) i++;
  if (source[i] !== "'" && source[i] !== '"' && source[i] !== '`') return '';
  return readQuoted(source, i)?.value ?? '';
}

function extractApiRows(source) {
  const rows = [];
  const re =
    /property:\s*(['"`])([\s\S]*?)\1[\s\S]*?type:\s*(['"`])([\s\S]*?)\3[\s\S]*?defaultValue:\s*(['"`])([\s\S]*?)\5[\s\S]*?descriptionKey:\s*(['"`])([\s\S]*?)\7/g;
  let match;
  while ((match = re.exec(source))) {
    rows.push({
      property: match[2],
      type: match[4],
      defaultValue: match[6],
      descriptionKey: match[8],
    });
  }
  return rows;
}

function extractKeyboardRows(source) {
  const rows = [];
  const re = /keys:\s*(['"`])([\s\S]*?)\1[\s\S]*?descriptionKey:\s*(['"`])([\s\S]*?)\3/g;
  let match;
  while ((match = re.exec(source))) {
    rows.push({ keys: match[2], descriptionKey: match[4] });
  }
  return rows;
}

function splitSentences(text) {
  const parts = text
    .match(/[^。！？.!?]+[。！？.!?]?/g)
    ?.map((part) => part.trim())
    .filter(Boolean);
  return parts?.length ? parts : text ? [text] : [];
}

function titleFromId(id) {
  return id
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildSpec(docsPath, translations) {
  const source = readFileSync(docsPath, 'utf-8');
  const name = extractField(source, 'componentId');
  if (!name) return null;

  const descriptionKey = extractField(source, 'descriptionKey');
  const accessibilityKey = source.match(/id:\s*'accessibility'[\s\S]*?descriptionKey:\s*'([^']+)'/)?.[1];
  const stateModelKey = source.match(/id:\s*'stateModel'[\s\S]*?descriptionKey:\s*'([^']+)'/)?.[1];

  const titleKey = extractField(source, 'titleKey');
  const spec = {
    name,
    title: translations[titleKey] || titleFromId(name),
    description: translations[descriptionKey] || '',
    aliases: ALIASES[name] ?? [],
    anatomy: extractField(source, 'composition').trim(),
    example: (extractField(source, 'basic') || extractField(source, 'usageMain')).trim(),
    usageImport: extractField(source, 'usageImport').trim(),
    api: extractApiRows(source).map((row) => ({
      property: row.property,
      type: row.type,
      defaultValue: row.defaultValue,
      description: translations[row.descriptionKey] || row.descriptionKey,
    })),
    keyboard: extractKeyboardRows(source).map((row) => ({
      keys: row.keys,
      action: translations[row.descriptionKey] || row.descriptionKey,
    })),
    accessibility: splitSentences(translations[accessibilityKey] || ''),
    stateModel: splitSentences(translations[stateModelKey] || ''),
  };

  for (const key of Object.keys(spec)) {
    const value = spec[key];
    if (value === '' || (Array.isArray(value) && value.length === 0)) {
      delete spec[key];
    }
  }
  return spec;
}

function main() {
  const translations = loadTranslations();
  const specs = {};
  const pages = readdirSync(DOCS_PAGES, { withFileTypes: true }).filter((entry) => entry.isDirectory());

  for (const page of pages) {
    const docsPath = join(DOCS_PAGES, page.name, `${page.name}.docs.ts`);
    if (!existsSync(docsPath)) continue;
    const spec = buildSpec(docsPath, translations);
    if (spec) specs[spec.name] = spec;
  }

  const ordered = Object.fromEntries(Object.keys(specs).sort().map((name) => [name, specs[name]]));
  const next = `${JSON.stringify(ordered, null, 2)}\n`;

  if (process.argv.includes('--check')) {
    const current = existsSync(OUT_PATH) ? readFileSync(OUT_PATH, 'utf-8') : '';
    if (current !== next) {
      console.error('✖ registry/specs.json is stale. Run: pnpm --filter @sanring/cli generate-specs');
      process.exit(1);
    }
    console.log(`✔ Component specs are up to date (${Object.keys(ordered).length})`);
    return;
  }

  writeFileSync(OUT_PATH, next, 'utf-8');
  console.log(`✔ Wrote ${Object.keys(ordered).length} component specs to ${OUT_PATH}`);
}

main();
