import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const source = resolve(process.argv[2] || '../chord-tools/src/music.ts');
const { CHORDS, SCALES, spellChord, chordNotes } = await import(pathToFileURL(source));
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

const lessonPath = resolve(dirname(source), '../guitar-chords-for-beginners/index.html');
const lesson = readFileSync(lessonPath, 'utf8');
const tuning = [40, 45, 50, 55, 59, 64];
const fingerings = [...lesson.matchAll(/<article class="chord-card-guide" id="chord-([^"]+)">([\s\S]*?)<\/article>/g)].map(([, symbol, card]) => {
  const frets = card.match(/<strong>Frets:<\/strong> ([X\d ]+) \(6/)[1].trim().split(/\s+/).map(n => n === 'X' ? -1 : Number(n));
  const fingers = [...card.matchAll(/<li>[^<]*?: (skip|open|finger (\d), fret \d+)\.<\/li>/g)].map(([, , finger]) => Number(finger || 0));
  const [, root, type] = card.match(/href="\/#root=(\d+)&amp;type=([^"]+)"/);
  const notes = [...new Set(frets.flatMap((fret, i) => fret < 0 ? [] : [(tuning[i] + fret) % 12]))].sort((a,b) => a-b);
  const expected = [...new Set(chordNotes(Number(root), type))].sort((a,b) => a-b);
  if (frets.length !== 6 || fingers.length !== 6 || JSON.stringify(notes) !== JSON.stringify(expected)) throw new Error(`Invalid source fingering: ${symbol}`);
  return { chord_symbol: symbol, root_pitch_class: Number(root), type_id: type, note_names: spellChord(Number(root), type), frets, fingers, source_url: `https://mychordfinder.com/guitar-chords-for-beginners#chord-${symbol}` };
});
if (fingerings.length !== 8) throw new Error('Expected the eight published beginner shapes.');
writeFileSync('data/guitar_fingerings.jsonl', fingerings.map(row => JSON.stringify(row)).join('\n') + '\n');
writeFileSync('fingering_sample.json', JSON.stringify(fingerings.find(row => row.chord_symbol === 'C'), null, 2) + '\n');
const provenance = JSON.parse(readFileSync('provenance.json', 'utf8'));
provenance.fingerings = { source_file: 'guitar-chords-for-beginners/index.html', source_sha256: createHash('sha256').update(lesson).digest('hex'), rows: fingerings.length, string_order: [6,5,4,3,2,1], tuning_midi: tuning, extraction: 'Fret numbers, finger assignments and root/type links parsed from the existing lesson cards; note_names use the application spelling function.' };
writeFileSync('provenance.json', JSON.stringify(provenance, null, 2) + '\n');
console.log(`Exported ${fingerings.length} existing beginner fingerings.`);
