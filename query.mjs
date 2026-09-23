import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const rows = readFileSync(new URL('./data/formulas.jsonl', import.meta.url), 'utf8')
  .trim().split('\n').map(line => JSON.parse(line));

/** Return pitch classes, not note spellings, voicings or MIDI note numbers. */
export function query(family, id, root) {
  if (!Number.isInteger(root) || root < 0 || root > 11) {
    throw new Error('Root must be an integer pitch class from 0 (C) to 11 (B).');
  }
  const record = rows.find(row => row.family === family && row.id === id);
  if (!record) throw new Error('Unknown family/id. Read data/formulas.csv for supported values.');
  return { ...record, root_pitch_class: root,
    pitch_classes: record.intervals_semitones.map(interval => (root + interval) % 12) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [family, id, value, ...extra] = process.argv.slice(2);
  if (!family || !id || value === undefined || !/^\d+$/.test(value) || extra.length) {
    console.error('Usage: node query.mjs <chord|scale> <id> <root 0..11>');
    process.exitCode = 1;
  } else {
    try { console.log(JSON.stringify(query(family, id, Number(value)), null, 2)); }
    catch (error) { console.error(error.message); process.exitCode = 1; }
  }
}
