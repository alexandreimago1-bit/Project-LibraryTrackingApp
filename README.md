# Library Tracker

Library Tracker is a personal reading-management web app for people who want one calm place to organise the books they own, plan to read, are currently reading, have finished, or want to buy.

The active React application lives in [`library-tracker/`](library-tracker/). The [`TEST_HTML&JS/`](TEST_HTML%26JS/) folder contains the earlier vanilla JavaScript experiment.

## Who It Is For

Library Tracker is designed for readers, students, book-club members, and anyone building a personal reading collection. It is currently a student project and is being developed as a free, small-scale application.

## What It Does

- Organises books into TBR, currently reading, finished, and shopping-list shelves.
- Displays currently reading books on the home dashboard.
- Tracks title, author, page count, genre, shelf status, and shelf order.
- Lets users sort shelves by custom order, title, author, or genre.
- Stores shopping status and planned purchase dates for wishlist books.
- Provides a reading-details page for notes and finishing a book.
- Provides an editable library card with a name, favourites, quote, and optional photo.
- Uses Supabase Auth so each signed-in user has their own private data.
- Uses Supabase PostgreSQL with Row Level Security for books, notes, and profiles.

## Current Status

The authenticated Supabase-backed React MVP is working. The frontend and database integration are complete for the current feature set. Automated tests, production deployment, local-data migration, and operational monitoring are still planned.

## Privacy And Responsible Use

The app stores an email address through authentication and may store profile information, an optional profile photo, book collections, and private reading notes. Those can be personal data.

Before opening the app to real users, prepare a privacy notice that explains:

- What data is collected and why.
- Where the data is stored and which service providers process it.
- How long data is retained.
- How users can access, correct, export, or delete their data.
- How users can contact the project owner.
- How security incidents will be handled.

The exact legal obligations depend on the users' locations and ages. Depending on where the app is offered, privacy rules may include the GDPR/UK GDPR, California privacy laws, or children's privacy rules. This README is not legal advice. Get local legal guidance before a public launch, especially if the app is used by children or collects sensitive information.

The safest initial design is data minimisation: do not collect information that the app does not need, do not make profiles public by default, and do not store secrets in book notes or profile fields.

## Admin Access And Monitoring

This app does **not** currently need an admin dashboard that reads people's libraries. An admin account is not automatically illegal, but secretly inspecting private books, notes, profiles, or photos would create serious privacy and trust problems and may violate applicable law.

If administration is needed later, keep it limited to:

- Aggregate service health and usage counts.
- Error logs and uptime monitoring.
- Abuse reports and account-support actions.
- Explicitly documented, role-protected access when support requires it.

Do not build hidden access to private user content. Any staff access should have a clear purpose, minimal permissions, audit logs, retention limits, and a transparent explanation in the privacy notice.

## More Documentation

See [`library-tracker/README.md`](library-tracker/README.md) for local development, Supabase setup, testing, and deployment notes.
