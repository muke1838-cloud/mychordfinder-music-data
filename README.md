# My Chord Finder Music Formulas

Author: **muke1838-cloud**. License: **CC0 1.0 Universal**; see [LICENSE](LICENSE).

## 1. What this data is

Reusable data for practice-app, music-education and composition-tool developers, exported from [My Chord Finder](https://mychordfinder.com/): **18 chord formulas, 8 scale formulas and 8 existing beginner guitar fingerings** (26 formula records plus 8 fingering records). Each record describes intervals above a root, rather than a separate record for every transposition.

These are this application's supported formulas, not an official or exhaustive music-theory reference. The fingerings are the eight choices already shown in the site's beginner lesson, not every possible way to finger these chords. The release contains no recordings, illustrations or user activity.

## 2. Fields and files

| Field | Type | Meaning and unit |
| --- | --- | --- |
| `family` | string | Source table: `chord` or `scale`; no unit. |
| `id` | string | Original application key, unique within its family; no unit. |
| `name` | string | Original English display name; no unit. |
| `intervals_semitones` | list of integers | Original offsets above the root, measured in semitones. Zero is the root. |
| `tool_url` | string | Application page using the formula family; HTTPS URL. |

- [JSON Lines](data/formulas.jsonl): one record per line, with native integer arrays.
- [CSV](data/formulas.csv): the same records; interval arrays are JSON encoded inside quoted CSV cells.
- [Small sample](sample.json): two actual records for quick inspection.
- [Provenance](provenance.json): source and dataset SHA-256 checksums, transformations and counts.

```json
{"family":"chord","id":"major","name":"Major","intervals_semitones":[0,4,7],"tool_url":"https://mychordfinder.com/"}
{"family":"scale","id":"minor-pentatonic","name":"Minor pentatonic","intervals_semitones":[0,3,5,7,10],"tool_url":"https://mychordfinder.com/guitar-scales"}
```

### Existing guitar fingerings

[Fingerings JSONL](data/guitar_fingerings.jsonl) contains one existing lesson shape per record.

| Field | Meaning |
| --- | --- |
| `chord_symbol` | Original displayed chord symbol, such as C or Am. |
| `root_pitch_class` | Integer pitch class: C=0 through B=11. |
| `type_id` | Original chord type key. |
| `note_names` | Chord-tone spellings from the application's spelling function. |
| `frets` | Six integers in string 6-to-1 order: -1 means muted, 0 open, positive numbers are fret positions. |
| `fingers` | Same string order: 0 means no fretting finger, 1 index, 2 middle, 3 ring, 4 pinky. |
| `source_url` | Link to the existing lesson card. |

Standard tuning is E A D G B E, low to high (MIDI 40, 45, 50, 55, 59, 64). Finger numbers are choices, not fret numbers.

[Inspect the C fingering sample](fingering_sample.json):

```json
{"chord_symbol":"C","root_pitch_class":0,"type_id":"major","note_names":["C","E","G"],"frets":[-1,3,2,0,1,0],"fingers":[0,3,2,0,1,0],"source_url":"https://mychordfinder.com/guitar-chords-for-beginners#chord-C"}
```

## 3. What you can use it for

Build a practice-app chord card from the fingering rows, explain chord tones in a teaching tool, or use the formulas in a composition widget or interval-handling test. For a root pitch class `r`, calculate each pitch class as `(r + interval) % 12`, with C represented by 0. This calculation does not choose a musical note spelling or a playable guitar fingering.

Keep the original interval values when register matters: extensions include offsets such as 14, 17 and 21. A formula with seven distinct chord tones is not a promise of a complete six-string guitar shape.

## 4. Where the data comes from

The formula records are exported directly from `CHORDS` and `SCALES` in the application's `src/music.ts`. Names, keys and interval order are preserved. No extra chords or transposed records were invented for this release. The eight fingering rows are parsed from the site's existing beginner lesson HTML, including its fret lists and finger instructions. The exporter checks that each shape produces exactly the corresponding chord-tone set; it does not run the page generator or change the website. The source application documents its independently implemented formulas with references including [Open Music Theory: Triads](https://viva.pressbooks.pub/openmusictheory/chapter/triads/), [Seventh Chords](https://viva.pressbooks.pub/openmusictheory/chapter/seventh-chords/) and [Fender's scale overview](https://www.fender.com/articles/scales/5-essential-guitar-scales-for-beginners).

To repeat the export from a local copy of the application, use Node.js with TypeScript stripping support:

```sh
node --experimental-strip-types export.mjs /path/to/chord-tools/src/music.ts
```

This exports the application's choices; it does not copy the referenced textbooks or their illustrations. CC0 applies to the material in this repository, not to third-party pages linked here.

## 5. Homepage and related tools

The application is [My Chord Finder](https://mychordfinder.com/). Explore the chord formulas in the [Piano Chord Finder](https://mychordfinder.com/piano-chords), and the scale formulas in [Guitar Scales](https://mychordfinder.com/guitar-scales). The [Pentatonic Scale guide](https://mychordfinder.com/pentatonic-scale) explains the two pentatonic examples and their shared notes.
