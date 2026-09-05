# Game of Life

A local-first personal operating system with a light RPG layer. It is designed for a calm daily loop: choose what matters, make a meaningful move, reflect briefly, and build a record of the life you are living.

## What is implemented

- Six core spaces: Today, Life, Quests, Progress, Journal, and Coach.
- Ten life pillars with individual XP, levels, importance, pulse, and a Life Wheel.
- Goal-linked main, weekly, daily, side, and recurring quests.
- Habits with flexible weekly cadence rather than punitive streak resets.
- Morning check-in, nightly recap, weekly-review prompts, seasonal context, achievements, and a life timeline.
- Journal entries that can link to a pillar or goal and be saved as memories.
- A permission-forward Coach prototype with evidence-linked planning prompts.
- Responsive, local-only data persistence in browser `localStorage`, plus JSON export.

The initial dashboard has been replaced. Existing data under `game-of-life.v1` is preserved in the browser but is not imported into the new `game-of-life.v2` model.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Data and privacy

No account or backend is required. The app stores its data in the current browser under the `game-of-life.v3` key. New installs start with no sample records. Use **Progress → Export your data** to keep a JSON backup. Clearing the browser’s site data removes local records.

See [PRODUCT_PLAN.md](./PRODUCT_PLAN.md) for the product strategy, the MVP/V2 boundary, data-model direction, and future integration plan.
