# Game of Life

A local-first morning dashboard for food, finances, fitness, and daily focus. It is built as a dependency-free static website so it is easy to commit, open locally, and publish with GitHub Pages.

## Features

- Morning dashboard with quick overview cards
- Food page with a calorie target, meal log, and recipe log
- Finances page with income/expense entries, bills, and savings goals
- Fitness page with workout logs and daily habit checkboxes
- All data is stored in the browser with `localStorage`
- No backend, build step, or account required

## Run Locally

Open `index.html` in a browser, or serve the folder with any static file server:

```bash
python3 -m http.server 5173
```

Then visit `http://localhost:5173`.

## Deploy

This project can be deployed as a static site. For GitHub Pages, use the repository root or the `GameOfLife` folder as the published source depending on where you commit it.

## Data

Data stays in the current browser under the `game-of-life.v1` localStorage key. Clearing site data will clear the dashboard.
