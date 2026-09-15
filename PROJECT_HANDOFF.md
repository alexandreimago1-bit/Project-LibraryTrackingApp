# Library Tracker Project Handoff

_Last updated: 2026-09-16_

## Learning Goal

Alex knows HTML, CSS, and JavaScript and is learning React through this project. Explain the reasoning behind React patterns before making changes. Do not blindly rewrite code or take over implementation unless Alex explicitly asks.

## Project Goal

Build a library tracking app for book lovers. The app should organize:

- Books waiting to be read
- Books currently being read
- Finished books
- Books Alex may want to buy later

The long-term goal is a full-stack version with a React frontend, backend API, database, authentication, and deployment. The current work is a React rebuild of the original vanilla JavaScript library app.

## Verified Current Project State

The project is in the functional React frontend MVP phase.

- The Vite React app is in `library-tracker/`.
- `npm run build` completes successfully.
- `npm run lint` completes successfully.
- `App.jsx` owns shared `library` and `profile` state.
- `useState(loadLibrary)` and `useState(loadProfile)` load saved data from localStorage when the app starts.
- `useEffect` saves library and profile changes back to localStorage.
- React Router is installed and functioning with a shared `RootLayout`.
- `RootLayout.jsx` owns navigation and passes shared data through `<Outlet context={...} />`.
- `rootlayout.css` implements a responsive two-column desktop layout with a horizontal navigation layout on small screens.
- Component-specific CSS lives in `src/styles/` and is imported by the component or page that uses it.

### Book data

Book records are normalised in `storage.js` and may contain:

```js
{
  id,
  title,
  author,
  pages,
  genre,
  status: "wishlist" | "tbr" | "reading" | "finished",
  notes,
  purchaseStatus,
  plannedPurchaseDate,
  arrivalDate,
  shelfOrder
}
```

Storage utilities currently include:

- `createBook`
- `addBook`
- `updateBook`
- `startReading`
- `finishedReading`
- `moveToTbr`
- `moveBook`
- `removeBook`
- `saveLibrary`
- `loadLibrary`
- `saveProfile`
- `loadProfile`

### Routes

Routes are declared in `src/App.jsx`:

- `/` - Home dashboard
- `/library` - Library overview with shelf summaries
- `/shelves` - All shelves, with optional `?status=tbr` or `?status=finished` filtering
- `/cart` - Shopping List / wishlist
- `/reading/:bookId` - Reading details and notes for one book
- `/profile` - Editable library-card profile

## Current Features

### Home dashboard

`Home.jsx` currently:

- Shows the Library Tracker heading and introductory text.
- Shows every book currently marked as `reading`.
- Links each reading book to its reading-details page.
- Displays a styled book-like reading card.
- Shows a profile/library card with name, age, favourite genre, favourite book, quote, and optional photo.
- Shows links and counts for the TBR shelf, shopping list, and finished shelf.

### Library overview and shelves

`LibraryOverview.jsx` shows three shelf summaries:

- To Be Read
- Finished Books
- Shopping List

`Library.jsx` supports:

- Adding a book to TBR, reading, or finished status.
- Removing books.
- Starting a TBR book.
- Finishing a reading book.
- Sorting by shelf order, title, author, or genre.
- Moving books left and right when using custom shelf order.
- Filtering to a specific shelf through the URL query string.

`BookCard.jsx` is a reusable presentational component for shelf books. It receives the book and action handlers as props.

### Shopping list

`Cart.jsx` supports wishlist books with:

- Title, author, page count, and genre.
- Purchase status: planned, ordered, or arrived.
- Planned purchase and arrival dates.
- Removing a book.
- Moving a bought book to the TBR shelf.

### Reading details

`ReadingDetails.jsx` supports:

- Viewing one reading book.
- Adding notes with a date.
- Deleting notes.
- Marking the book as finished and returning to the finished shelf.

### Profile

`Profile.jsx` supports editing and saving:

- Name
- Age
- Favourite genre
- Favourite book
- Profile photo
- Favourite quote

Profile data is persisted in localStorage separately from the library.

## React Concepts Currently in Use

- Shared state lifted into `App.jsx`.
- Derived values calculated during render from current state.
- `useState` for library, profile, forms, menus, and notes.
- `useEffect` for localStorage persistence.
- Controlled form inputs.
- Reusable components with props and callback handlers.
- React Router nested routes and dynamic route parameters.
- `useOutletContext` for sharing state through the route layout.
- Immutable state updates using array methods and object spreading.
- `useMemo` for grouped and sorted shelf data in `Library.jsx`.

## Known Gaps and Risks

- There are no automated component or end-to-end tests yet.
- Data is stored only in the current browser's localStorage; there is no backend or account sync.
- Reading progress, a reading timer, and richer book details are not implemented.
- Book form validation is intentionally basic and mostly relies on required fields and positive page counts.
- The app needs more responsive and accessibility testing across real browser sizes.
- The original `TEST_HTML&JS/` files are retained as the earlier vanilla JavaScript experiment; the active app is `library-tracker/`.
- Backend, database, authentication, and deployment are future work.

## Recommended Next Priorities

1. Add focused tests for storage utilities and the main book-status flows.
2. Improve form validation and user feedback for invalid or destructive actions.
3. Review mobile layouts and keyboard/accessibility behavior.
4. Expand reading details with progress tracking or a reading timer.
5. Decide which data model should remain local-only before designing a backend API.
6. Add the backend, database, authentication, and deployment after the frontend behavior is stable.

## Working Style

- Explain the idea before suggesting code.
- Prefer small edits Alex can type and understand.
- Ask Alex to predict behavior or test a change when useful.
- Inspect the real files when context is uncertain.
- Do not commit, rewrite, or make broad changes without permission.
- Use the existing project structure and patterns.
- Run `npm run lint` and `npm run build` after meaningful changes when practical.

## Suggested Restart Prompt

> Continue from `PROJECT_HANDOFF.md`. I am learning React through my Library Tracker. Please explain the next React concept first, then guide me through the smallest change. Check the live code before assuming a feature is missing, and do not blindly edit my files.