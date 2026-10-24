# Rwanda Weather Explorer

A single-page app that loads a 7-day forecast for eight Rwandan cities and lets you search, filter, sort and open details for each city.

- **Author:** [Your full name]
- **Course:** Advanced Frontend Web Development, Week 5
- **API:** Open-Meteo Forecast API, docs at https://open-meteo.com/en/docs
- **Live app:** [paste your Vercel link]
- **Video demo:** [paste your video link]

## Features

- Data loads on page open with `async/await` and a reusable `getJSON` that checks `response.ok` and throws an `Error` with the status
- Loading skeletons, error state with a Retry button, and an empty state, with an `aria-live` status message
- Responsive card grid (1, 2, then 4 columns) built with `map` and destructuring
- Case-insensitive live search, a province filter built from the data, and four sort options using `toSorted`
- Stats bar computed with `reduce` (cities shown, average high, total rain)
- Details dialog that fetches the selected city's forecast and shows all 7 days
- Eight requests run in parallel with `Promise.allSettled`, so one failed city does not break the rest
- Accessible: labelled controls, descriptive `aria-label` on cards, keyboard-operable cards and dialog, focus returns to the card on close
- All API text is escaped with `escapeHTML` before it goes into `innerHTML`
- **Bonus (+5):** debounced search (300 ms)

## State shape and state to render flow

```js
const state = {
  items: [],        // loaded cities with their days
  failed: [],       // names of cities whose request failed
  status: "loading",// "loading" | "success" | "error"
  error: null,
  query: "",
  filter: "all",
  sort: "default",
  detail: { status: "idle", city: null, days: [], error: null },
}
```

Every event (load, search, filter, sort, card click, retry) updates `state` and then calls `render(state)`. `render` reads the state, runs the pure helpers `getVisibleItems` and `getStats`, and redraws the page. Searching, filtering and sorting never fetch again, because they work on the data already in `state.items`.

## Raw API JSON and how I transformed it

Open-Meteo returns parallel arrays, and the city name is not included (shortened):

```json
{
  "timezone": "Africa/Kigali",
  "daily": {
    "time": ["2026-10-24", "2026-10-25"],
    "temperature_2m_max": [26.2, 26.4],
    "temperature_2m_min": [16.2, 15.2],
    "precipitation_sum": [6.8, 2.0]
  }
}
```

`toForecastDays` zips the arrays by index into one object per day, using defaults and `??` for missing values:

```js
[
  { date: "2026-10-24", max: 26.2, min: 16.2, rain: 6.8 },
  { date: "2026-10-25", max: 26.4, min: 15.2, rain: 2.0 },
]
```

Each city from my `CITIES` list is then merged with its days using spread: `{ ...city, days }`.

## Screenshots

**Loading**

![Loading state](screenshots/loading.png)

**Success**

![Success state](screenshots/success.png)

**Empty**

![Empty state](screenshots/empty.png)

**Error**

![Error state](screenshots/error.png)

## What I learned about async JavaScript

[Write 5 to 8 sentences in your own words.]

## How to run locally

```bash
git clone https://github.com/utuje-ange12/week5-async-data-explorer.git
cd week5-async-data-explorer
npm install
npm run dev
```

Open http://localhost:5173. To make a production build, run `npm run build`.

## Project structure

- `index.html`: page markup
- `src/api.js`: `getJSON`, the city list, and the parallel requests
- `src/render.js`: all DOM and template functions
- `src/main.js`: state object and event handlers
- `src/utils.js`: `escapeHTML`, data transformation, filtering, sorting, stats, debounce