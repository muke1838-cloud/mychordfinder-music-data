import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const source = resolve(process.argv[2] || '../chord-tools/src/music.ts');
const { CHORDS, SCALES } = await import(pathToFileURL(source));
const records = [
  ...Object.entries(CHORDS).map(([id, value]) => ({ family: 'chord', id, name: value.name, intervals_semitones: value.intervals, tool_url: 'https://mychordfinder.com/' })),
  ...Object.entries(SCALES).map(([id, value]) => ({ family: 'scale', id, name: value.name, intervals_semitones: value.intervals, tool_url: 'https://mychordfinder.com/guitar-scales' })),
];
mkdirSync('data', { recursive: true });
writeFileSync('data/formulas.jsonl', records.map(row => JSON.stringify(row)).join('\n') + '\n');
const columns = ['family', 'id', 'name', 'intervals_semitones', 'tool_url'];
const cell = value => '"' + String(value).replaceAll('"', '""') + '"';
writeFileSync('data/formulas.csv', columns.join(',') + '\n' + records.map(row => columns.map(key => cell(Array.isArray(row[key]) ? JSON.stringify(row[key]) : row[key])).join(',')).join('\n') + '\n');
writeFileSync('sample.json', JSON.stringify([records.find(row => row.family === 'chord' && row.id === 'major'), records.find(row => row.family === 'scale' && row.id === 'minor-pentatonic')], null, 2) + '\n');
writeFileSync('provenance.json', JSON.stringify({ source_file: 'src/music.ts', source_sha256: createHash('sha256').update(readFileSync(source)).digest('hex'), exported_constants: ['CHORDS', 'SCALES'], transformations: ['Object keys become id', 'intervals renamed intervals_semitones without changing values', 'family and tool_url identify the source table and application'], counts: { chords: Object.keys(CHORDS).length, scales: Object.keys(SCALES).length, total: records.length }, dataset_sha256: createHash('sha256').update(readFileSync('data/formulas.jsonl')).digest('hex') }, null, 2) + '\n');
console.log(`Exported ${records.length} formulas.`);
