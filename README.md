# Game of Life

A local-first React morning dashboard for food, finances, fitness, and daily focus. It is built with Vite, React, and localStorage so it stays private while still being easy to deploy as a static site.

## Features

- Morning dashboard with quick overview cards
- Food page with a calorie target, 7-day calorie bar chart, meal log, and structured recipe log
- Finances page with monthly cashflow, budget categories, spending mix, income/expense entries, bills, savings goals, debts, and subscriptions
- Fitness page with workout logs and daily habit checkboxes
- All data is stored in the browser with `localStorage`
- No backend or account required

## Run Locally

Install dependencies and start Vite:

```bash
npm install
npm run dev
```

Then visit the local URL Vite prints in the terminal.

## Build

```bash
npm run build
```

## Deploy

This project can be deployed as a static site. For GitHub Pages, build with `npm run build` and publish the generated `dist` folder.

## Data

Data stays in the current browser under the `game-of-life.v1` localStorage key. Clearing site data will clear the dashboard.
