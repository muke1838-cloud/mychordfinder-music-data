---
license: cc0-1.0
language:
  - en
pretty_name: My Chord Finder Music Formulas
size_categories:
  - n<1K
tags:
  - music
  - chords
  - scales
  - tabular
configs:
  - config_name: default
    data_files:
      - split: train
        path: data/formulas.jsonl
---

# My Chord Finder Music Formulas

Author: **muke1838-cloud**. License: **CC0 1.0 Universal**; see [LICENSE](LICENSE).

## 1. What this data is

A small export of the formula tables used by [My Chord Finder](https://mychordfinder.com/): **18 chord formulas and 8 scale formulas, 26 records in total**. Each record describes intervals above a root, rather than a separate record for every transposition.

These are this application's supported formulas, not an official or exhaustive music-theory reference. The release contains no recordings, diagrams, user activity or fingering annotations. The Hugging Face `train` split is a file-loading convention, not a claim that this is a training benchmark.

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

## 3. What you can use it for

Use the formulas in chord/scale widgets, educational examples or tests of interval handling. For a root pitch class `r`, calculate each pitch class as `(r + interval) % 12`, with C represented by 0. This calculation does not choose a musical note spelling or a playable guitar fingering.

Keep the original interval values when register matters: extensions include offsets such as 14, 17 and 21. A formula with seven distinct chord tones is not a promise of a complete six-string guitar shape.

## 4. Where the data comes from

The records are exported directly from `CHORDS` and `SCALES` in the application's `src/music.ts`. Names, keys and interval order are preserved. No extra chords or transposed records were invented for this release. The source application documents its independently implemented formulas with references including [Open Music Theory: Triads](https://viva.pressbooks.pub/openmusictheory/chapter/triads/), [Seventh Chords](https://viva.pressbooks.pub/openmusictheory/chapter/seventh-chords/) and [Fender's scale overview](https://www.fender.com/articles/scales/5-essential-guitar-scales-for-beginners).

To repeat the export from a local copy of the application, use Node.js with TypeScript stripping support:

```sh
node --experimental-strip-types export.mjs /path/to/chord-tools/src/music.ts
```

This exports the application's choices; it does not copy the referenced textbooks or their illustrations. CC0 applies to the material in this repository, not to third-party pages linked here.

## 5. Homepage and related tools

The application is [My Chord Finder](https://mychordfinder.com/). Explore the chord formulas in the [Piano Chord Finder](https://mychordfinder.com/piano-chords), and the scale formulas in [Guitar Scales](https://mychordfinder.com/guitar-scales). The [Pentatonic Scale guide](https://mychordfinder.com/pentatonic-scale) explains the two pentatonic examples and their shared notes.
