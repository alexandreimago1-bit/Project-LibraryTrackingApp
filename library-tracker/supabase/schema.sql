create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'Your name',
  age integer check (age is null or age >= 0),
  favorite_genre text not null default '',
  favorite_book text not null default '',
  quote text not null default 'A reader lives a thousand lives before they die.',
  photo_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  author text not null,
  pages integer not null check (pages > 0),
  genre text not null default '',
  status text not null check (status in ('wishlist', 'tbr', 'reading', 'finished')),
  purchase_status text not null default 'planned' check (purchase_status in ('planned', 'ordered', 'arrived')),
  planned_purchase_date date,
  arrival_date date,
  shelf_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null check (char_length(trim(text)) > 0),
  created_at timestamptz not null default now()
);

create index books_user_id_status_order_idx on public.books(user_id, status, shelf_order);
create index notes_book_id_created_at_idx on public.notes(book_id, created_at);

alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.notes enable row level security;

create policy "Users can manage their own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can manage their own books"
  on public.books for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage their own notes"
  on public.notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();
