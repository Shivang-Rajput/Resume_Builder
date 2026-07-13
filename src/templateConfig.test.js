import test from 'node:test';
import assert from 'node:assert/strict';
import { builtInTemplates, normalizeTemplateConfig, mergeTemplateOptions } from './templateConfig.js';

test('built-in registry exposes three ATS-friendly templates', () => {
  assert.equal(builtInTemplates.length, 3);
  const ids = builtInTemplates.map((template) => template.id);
  assert.deepEqual(ids, ['ats-classic', 'ats-modern', 'ats-compact']);
  assert.ok(builtInTemplates.every((template) => template.atsFriendly));
});

test('custom template config is normalized and merged', () => {
  const custom = normalizeTemplateConfig({
    id: 'custom-1',
    name: 'Executive Draft',
    description: 'A compact ATS variant for leadership roles.',
    layout: 'single-column',
    atsFriendly: true,
  });

  assert.equal(custom.id, 'custom-1');
  assert.equal(custom.name, 'Executive Draft');
  assert.equal(custom.custom, true);
  assert.ok(custom.sections.includes('experience'));

  const merged = mergeTemplateOptions(builtInTemplates, [custom]);
  assert.equal(merged.length, 4);
  assert.equal(merged[3].id, 'custom-1');
});
