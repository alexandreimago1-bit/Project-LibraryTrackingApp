# Library Tracker Project Handoff

_Last updated: 2026-09-09_

## Learning Goal

Alex knows HTML, CSS, and JavaScript and is learning React through this project. Explain the reasoning behind React patterns before making changes. Do not blindly rewrite code or take over implementation unless Alex explicitly asks.

## Project Goal

Build a library tracking app for book lovers. The app should organize:

- Books currently owned
- To-be-read books
- Books currently being read
- Finished books
- Books Alex may want to buy later

The long-term goal is a full-stack version with a React frontend, backend API, database, authentication, and deployment. The current work is a React rebuild of the original vanilla JavaScript library app.

## Verified Current Project State

This project is actively in the React phase.

- The Vite React app is running in `library-tracker/`.
- `npm run build` completes successfully.
- `App.jsx` owns the shared `library` state.
- `useState(loadLibrary)` reads saved books from localStorage when the app loads.
- `useEffect` saves the library whenever the state changes.
- `storage.js` contains the library data utilities:
  - `createBook`
  - `addBook`
  - `startReading`
  - `finishedReading`
  - `removeBook`
  - `saveLibrary`
  - `loadLibrary`
- Book data shape:

```js
{
  id,
  title,
  author,
  pages,
  genre,
  status: "tbr" | "reading" | "finished"
}
```

- React Router is installed and functioning.
- `RootLayout.jsx` contains shared navigation (`<nav>` with Home/Library links) and nested route rendering via `<Outlet context={{ library, setLibrary }} />`.
- `App.jsx` passes `library` and `setLibrary` through the route context.
- `Home.jsx` reads the shared data with `useOutletContext()`.
- `Library.jsx` supports adding books, removing books, starting a book, and finishing a book.
- `BookCard.jsx` is a reusable presentational component that receives data and action handlers.
- `src/styles/token.css` contains design system tokens (colors, spacing, fonts) — shared/reusable values only, not component-specific layout.
- Project convention: component-specific CSS lives in `src/styles/`, named after the component (e.g. `src/styles/Home.css`), and is imported directly into that component file.
- `localStorage` persistence is working as part of the app state flow.

## Current Status Summary

The foundation is in place and the project is functional at a basic level. The app currently supports:

- reading and saving books in shared state
- navigating between Home and Library pages
- adding new books
- updating book status between TBR, reading, and finished
- removing books
- showing the current reading book on the Home page
- a working grid-based visual layout on the Home page (see below)

## Changes Made This Session

### 1. Fixed Home page state flow (derived values bug)

`totalBooks`, `finishedBooks`, and `tbrBooks` were originally declared in module scope, below the `Home` component's closing brace — referencing `library`, a variable that only exists inside the component. This would throw a `ReferenceError` at runtime and the values could never be used in JSX anyway.

Fix: moved all three derived values inside the `Home` component body, alongside `currentlyReading`, so they're computed fresh from `library` on every render:

```jsx
function Home() {
  const { library } = useOutletContext();

  const currentlyReading = library.find((book) => book.status === "reading");
  const totalBooks = library.length;
  const finishedBooks = library.filter((book) => book.status === "finished").length;
  const tbrBooks = library.filter((book) => book.status === "tbr").length;

  return <main>{/* UI */}</main>;
}
```

Key concept: values derived from state should be computed in render, not declared outside component scope.

### 2. Designed the Home page layout

Alex specified the intended visual layout for `Home.jsx`:

- Top center: "Library Tracker" title, spanning full width
- Middle: currently-reading section (styled like a closed book, showing title + author) on the left, a clickable library card on the right
- Bottom: library stats (no section title/heading — just three `<p>` values) centered under the currently-reading section, in the same row as the library card

Approximate grid shape:

```
[ nav | title |      ]
[ nav | book  | card ]
[      stats  | card ]
```

### 3. Split layout into two nested grids (RootLayout + Home)

Key concept: `RootLayout` and `Home` are separate components, so they can't share one literal `grid-template-areas`. `RootLayout` owns the outer layout (nav + routed content), and `Home` owns its own internal layout (title/book/card/stats). This is the idiomatic React approach — each component owns its own layout, and layouts compose via nesting rather than one shared global grid.

- `RootLayout.jsx` (or its CSS) becomes a 2-column outer grid: `nav` on the left, `<Outlet />` content filling the rest. **Not yet implemented — next step.**
- `Home.jsx` has its own internal grid for `title` / `book` / `card` / `stats`. **Implemented.**

### 4. Implemented `Home.jsx` structure and `src/styles/Home.css`

`Home.jsx` current structure:

```jsx
import { useOutletContext } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const { library } = useOutletContext();

  const currentlyReading = library.find((book) => book.status === "reading");
  const totalBooks = library.length;
  const finishedBooks = library.filter((book) => book.status === "finished").length;
  const tbrBooks = library.filter((book) => book.status === "tbr").length;

  return (
    <main className="home-grid">
      <h1 className="home-title">Library Tracker</h1>

      {currentlyReading ? (
        <section className="reading-book">
          <h3>{currentlyReading.title}</h3>
          <p>{currentlyReading.author}</p>
        </section>
      ) : (
        <p className="reading-book">No book currently being read.</p>
      )}

      <aside className="library-card">
        {/* clickable card content: not yet implemented */}
      </aside>

      <section className="home-stats">
        <h2>Library Stats</h2>
        <div className="stats-row">
          <p>Total Books: {totalBooks}</p>
          <p>Finished Books: {finishedBooks}</p>
          <p>To Be Read: {tbrBooks}</p>
        </div>
      </section>
    </main>
  );
}

export default Home;
```

`src/styles/Home.css` (grid layout + stats row):

```css
.home-grid {
  display: grid;
  grid-template-columns: 1fr 250px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "title title"
    "book  card"
    "stats card";
  min-height: 100vh;
  gap: 1rem;
}

.home-title   { grid-area: title; text-align: center; }
.reading-book { grid-area: book; }
.library-card { grid-area: card; }

.home-stats {
  grid-area: stats;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stats-row {
  display: flex;
  gap: 2rem;
}
```

Layout logic recap:
- `.home-stats` stacks its own children vertically (`<h2>` on top, `.stats-row` below), centered horizontally via `align-items: center`.
- `.stats-row` is a separate nested flex container that lays the three `<p>` stat values out horizontally.
- This two-level nesting was necessary because a single `display: flex` on `.home-stats` was putting the `<h2>` into the same row as the three stats — flex direction only applies to direct children, so title and stats needed separate flex containers.

## Known Gaps / Issues

- **`RootLayout.jsx` outer grid not yet implemented.** Currently just a plain `<div>` wrapping `<nav>` and `<Outlet />`. Needs a 2-column grid (`nav` | routed content) to complete the full intended layout with nav spanning the left side.
- `library-card` (`<aside>`) is currently an empty shell — no content, no click behavior yet.
- `reading-book` section is not yet styled to look like a "closed book" (visual styling not started, only structure/data is in place).
- Design tokens from `src/styles/token.css` are not yet applied to `Home.css` (currently using raw values, no token variables).
- `Library.jsx` and `BookCard.jsx` have not been touched this session — still on the original design tokens.
- Wishlist, filtering, sorting, timer, backend, database, auth, and deployment are still future work.

## Next Session Priorities

### 1. Implement `RootLayout.jsx` outer grid

Add a 2-column grid so nav spans the left side alongside all routed page content, matching the layout Alex sketched out. Needs its own CSS file (e.g. `src/styles/RootLayout.css`) following the same per-component CSS convention as `Home.css`.

### 2. Style the "closed book" look for currently reading

Alex wants the currently-reading section to visually resemble a closed book cover, with the title (and author) displayed on it.

### 3. Style and wire up the library card

Make `.library-card` look like an actual clickable card (not just an empty aside) and decide what it should do on click (likely navigate to `/library`).

### 4. Apply design tokens

Replace raw CSS values in `Home.css` with variables from `src/styles/token.css` once the layout is finalized.

### 5. Stretch features after the foundation is solid

1. Add filtering and sorting to the Library page.
2. Add wishlist functionality.
3. Keep reading timer, details view, backend, database, authentication, and deployment parked until the React foundation is stable.

## Working Style

- Explain the idea before suggesting code.
- Prefer small edits that Alex can type and understand.
- Ask Alex to predict behavior or test a change when useful.
- Inspect the real files when context is uncertain.
- Do not commit, rewrite, or make broad changes without permission.
- Use the existing project structure and patterns (per-component CSS in `src/styles/`).

## Suggested Restart Prompt

> Continue from `PROJECT_HANDOFF.md`. I am learning React through my Library Tracker. Please explain the next React concept first, then guide me through the smallest change. Do not blindly edit my files.