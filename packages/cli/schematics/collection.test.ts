import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

const collectionPath = join(__dirname, 'collection.json');
const collection = JSON.parse(readFileSync(collectionPath, 'utf-8'));

describe('schematics collection.json', () => {
  it('declares the ng-add schematic with a resolvable factory and schema', () => {
    const ngAdd = collection.schematics['ng-add'];
    expect(ngAdd).toBeDefined();

    const [factoryPath] = ngAdd.factory.split('#');
    expect(existsSync(join(dirname(collectionPath), `${factoryPath}.ts`))).toBe(true);
    expect(existsSync(join(dirname(collectionPath), ngAdd.schema))).toBe(true);
  });
});
