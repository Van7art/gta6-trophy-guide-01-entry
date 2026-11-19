# gta6-trophy-guide-01-entry

[![gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Van7art/gta6-trophy-guide-01-entry/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Van7art/gta6-trophy-guide-01-entry/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

**Leonida Trophy Dashboard** — the offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: 1 Platinum, 2 Gold, 6 Silver and 46 Bronze, 28 of them hidden, none of them online.

Every trophy is shown with its official name, description and grade as PlayStation publishes them, plus a guide written in our own words that cites its sources (PowerPyx, PSNProfiles, Exophase, GTA Zone, KeenGamer, Output Lag). The tracker saves your progress in the browser (localStorage), exports it to a file and imports it back, filters by kind (story, missable, collectibles, activities, online), searches, and has a spoiler setting that hides the names and descriptions of story trophies until they are earned. A five-stage roadmap leads to the platinum in about 200 hours, and the set's one potentially missable trophy — **Positive Mental Attitude**, the Chapter 1 balcony meditation — is flagged throughout.

The app is plain static files under `app/` and works with the network off. No Rockstar logo or artwork is used.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

## Links

- Bounty: https://make.fun/bounty/gta6-trophy-guide-01
- Referral: https://make.fun/?ref=4e96xqxt
