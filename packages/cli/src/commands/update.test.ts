import { describe, expect, it } from 'vitest';
import { hashContent } from '../utils.js';
import { classifyUpdate } from './update.js';

describe('classifyUpdate', () => {
  it('is unchanged when local already matches remote', () => {
    expect(classifyUpdate('button/index.ts', '/dest', 'same', 'same', undefined)).toEqual({
      kind: 'unchanged',
    });
  });

  it('auto-applies when local matches the recorded baseline hash', () => {
    const baseline = hashContent('old registry content');
    expect(
      classifyUpdate('button/index.ts', '/dest', 'old registry content', 'new registry content', baseline),
    ).toEqual({
      kind: 'auto',
      label: 'button/index.ts',
      dest: '/dest',
      remote: 'new registry content',
    });
  });

  it('flags a conflict when local no longer matches the recorded baseline', () => {
    const baseline = hashContent('old registry content');
    expect(
      classifyUpdate('button/index.ts', '/dest', 'hand-edited content', 'new registry content', baseline),
    ).toEqual({
      kind: 'conflict',
      label: 'button/index.ts',
      dest: '/dest',
      local: 'hand-edited content',
      remote: 'new registry content',
    });
  });

  it('flags a conflict when there is no recorded baseline at all', () => {
    expect(
      classifyUpdate('button/index.ts', '/dest', 'local content', 'remote content', undefined),
    ).toEqual({
      kind: 'conflict',
      label: 'button/index.ts',
      dest: '/dest',
      local: 'local content',
      remote: 'remote content',
    });
  });
});
