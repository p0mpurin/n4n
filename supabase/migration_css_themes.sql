-- One-off migration: add shared CSS themes gallery (run in Supabase SQL Editor if schema predates css_themes).
-- Safe to run once; uses IF NOT EXISTS where applicable.

create table if not exists public.css_themes (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid not null references public.profiles(id) on delete cascade,
  title         text not null
                  check (char_length(title) >= 1 and char_length(title) <= 120),
  description   text not null default '',
  css           text not null
                  check (char_length(css) >= 1 and char_length(css) <= 262144),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists css_themes_created_at_idx on public.css_themes (created_at desc);
create index if not exists css_themes_author_idx on public.css_themes (author_id);

alter table public.css_themes enable row level security;

drop policy if exists "Anyone can read css themes" on public.css_themes;
create policy "Anyone can read css themes"
  on public.css_themes for select
  using (true);

drop policy if exists "Authors insert css themes" on public.css_themes;
create policy "Authors insert css themes"
  on public.css_themes for insert
  with check (auth.uid() = author_id);

drop policy if exists "Authors update own css themes" on public.css_themes;
create policy "Authors update own css themes"
  on public.css_themes for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "Authors delete own css themes" on public.css_themes;
create policy "Authors delete own css themes"
  on public.css_themes for delete
  using (auth.uid() = author_id);

drop trigger if exists css_themes_updated_at on public.css_themes;
create trigger css_themes_updated_at
  before update on public.css_themes
  for each row execute function public.handle_updated_at();
