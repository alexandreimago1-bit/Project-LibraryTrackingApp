# Supabase setup

1. Create a free Supabase project.
2. Open SQL Editor in the Supabase dashboard.
3. Run `schema.sql` once.
4. Copy the project URL and anon/publishable key into a local `.env.local` file:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_or_publishable_key
```

Never commit `.env.local` or a service-role key. The browser may use the anon/publishable key because Row Level Security protects the tables.
