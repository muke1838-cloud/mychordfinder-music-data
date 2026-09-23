import { test } from 'node:test';
import assert from 'node:assert/strict';
import { query } from './query.mjs';
import { spawnSync } from 'node:child_process';

test('C major and A minor pentatonic pitch classes', () => {
  assert.deepEqual(query('chord', 'major', 0).pitch_classes, [0, 4, 7]);
  assert.deepEqual(query('scale', 'minor-pentatonic', 9).pitch_classes, [9, 0, 2, 4, 7]);
});
test('diminished qualities stay distinct across octave wrap', () => {
  assert.deepEqual(query('chord', 'dim', 11).pitch_classes, [11, 2, 5]);
  assert.deepEqual(query('chord', 'dim7', 11).pitch_classes, [11, 2, 5, 8]);
  assert.deepEqual(query('chord', 'm7b5', 11).pitch_classes, [11, 2, 5, 9]);
});
test('invalid roots and unknown IDs fail explicitly', () => {
  for (const root of [-1, 12, 1.5, NaN]) assert.throws(() => query('chord', 'major', root));
  assert.throws(() => query('chord', 'imaginary', 0));
  assert.throws(() => query('other', 'major', 0));
});
test('CLI rejects missing root rather than treating it as C', () => {
  const result = spawnSync(process.execPath, ['query.mjs', 'chord', 'major'], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Usage/);
});
