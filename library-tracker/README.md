# Library Tracker App

This folder contains the active React frontend for Library Tracker. It uses Vite, React Router, Supabase Auth, and Supabase PostgreSQL.

## Features

- Email/password sign-up, email confirmation, login, and logout.
- Private user-specific books through Supabase Row Level Security.
- TBR, currently reading, finished, and wishlist shelves.
- Book creation, deletion, status changes, sorting, and manual shelf ordering.
- Wishlist purchase status and purchase dates.
- Reading notes that can be added and deleted.
- A saved profile card with an optional photo.
- A required privacy-notice acknowledgment during account creation, recorded with the Supabase Auth user metadata.
- Responsive navigation and layouts for desktop and mobile screens.

## Requirements

- Node.js and npm.
- A free Supabase project.

## Local Setup

From the repository root:

```bash
cd library-tracker
npm install
```

Create `.env.local` in this folder:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

The publishable key is safe for browser code when Row Level Security is configured. Never place a Supabase secret or service-role key in this file.

In the Supabase dashboard:

1. Create a free project.
2. Open **SQL Editor**.
3. Run [`supabase/schema.sql`](supabase/schema.sql) once.
4. Confirm that `profiles`, `books`, and `notes` appear in **Table Editor**.

## Run Locally

```bash
npm run dev
```

Open the local URL printed by Vite, create an account, confirm the email, and log in.

## Validation Commands

```bash
npm run lint
npm run build
```

## Data And Privacy

The app may store an account email, profile fields, an optional profile photo, book collections, purchase details, and reading notes. These may be personal data. Supabase Row Level Security limits database access to the signed-in user.

Before sharing the app publicly, add a privacy notice covering collection purposes, storage providers, retention, deletion/export requests, contact details, and security incidents. The applicable law depends on the users' locations and ages; GDPR/UK GDPR, California privacy laws, and children's privacy rules may be relevant. This project documentation is not legal advice.

The app does not need an admin dashboard that reads private user libraries. Monitoring should initially be limited to service health, errors, aggregate usage, and abuse reports. Any future support access to user content should be necessary, role-protected, audited, limited, and disclosed to users.

## Current Limitations

- Automated tests are not implemented yet.
- Books stored by the previous localStorage version are not automatically migrated.
- The frontend connects directly to Supabase; there is no custom Node/Express API.
- Production deployment, backups, and monitoring still need to be configured.
