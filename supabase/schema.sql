-- =============================================
-- Niche4Niche — full schema
-- Run this in the Supabase SQL Editor once.
-- =============================================

-- 1. PROFILES
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique not null
                  check (username ~ '^[a-z0-9][a-z0-9_-]{1,18}[a-z0-9]$'),
  display_name  text not null default '',
  avatar_url    text not null default '',
  background_image_url text not null default '',
  bio           text not null default '',
  use_custom_page boolean not null default false,
  custom_page_html text not null default '',
  custom_page_css  text not null default '',
  sections      jsonb not null default '[]'::jsonb,
  style         jsonb not null default '{}'::jsonb,
  view_count    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Fast username lookup
create index if not exists profiles_username_idx on public.profiles (username);

-- RLS
alter table public.profiles enable row level security;

create policy "Anyone can read profiles"
  on public.profiles for select
  using (true);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();


-- 2. LIKES
create table if not exists public.likes (
  id               uuid primary key default gen_random_uuid(),
  liker_id         uuid not null references auth.users(id) on delete cascade,
  liked_profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at       timestamptz not null default now(),
  unique (liker_id, liked_profile_id)
);

create index if not exists likes_profile_idx on public.likes (liked_profile_id);

alter table public.likes enable row level security;

create policy "Anyone can read likes"
  on public.likes for select
  using (true);

create policy "Authed users can like"
  on public.likes for insert
  with check (auth.uid() = liker_id);

create policy "Users can remove own likes"
  on public.likes for delete
  using (auth.uid() = liker_id);


-- 3. FRIENDSHIPS
create table if not exists public.friendships (
  id            uuid primary key default gen_random_uuid(),
  requester_id  uuid not null references public.profiles(id) on delete cascade,
  addressee_id  uuid not null references public.profiles(id) on delete cascade,
  status        text not null default 'pending'
                  check (status in ('pending', 'accepted', 'declined')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (requester_id, addressee_id)
);

create index if not exists friendships_requester_idx on public.friendships (requester_id);
create index if not exists friendships_addressee_idx on public.friendships (addressee_id);

alter table public.friendships enable row level security;

create policy "Users can read own friendships"
  on public.friendships for select
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "Authed users can send requests"
  on public.friendships for insert
  with check (auth.uid() = requester_id);

create policy "Addressee can update friendship status"
  on public.friendships for update
  using (auth.uid() = addressee_id)
  with check (auth.uid() = addressee_id);

create policy "Either party can delete friendship"
  on public.friendships for delete
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

create trigger friendships_updated_at
  before update on public.friendships
  for each row execute function public.handle_updated_at();


-- 4. CSS THEMES (shared gallery — CSS only, instant publish)
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

create policy "Anyone can read css themes"
  on public.css_themes for select
  using (true);

create policy "Authors insert css themes"
  on public.css_themes for insert
  with check (auth.uid() = author_id);

create policy "Authors update own css themes"
  on public.css_themes for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

create policy "Authors delete own css themes"
  on public.css_themes for delete
  using (auth.uid() = author_id);

create trigger css_themes_updated_at
  before update on public.css_themes
  for each row execute function public.handle_updated_at();


-- 5. VIEW INCREMENT RPC (avoids RLS issues for anonymous viewers)
create or replace function public.increment_view(profile_id uuid)
returns void as $$
begin
  update public.profiles
  set view_count = view_count + 1
  where id = profile_id;
end;
$$ language plpgsql security definer;


-- 6. RESERVED USERNAMES (checked application-side, listed here for reference)
-- studio, login, signup, preview, settings, api, admin, about, help, terms, privacy, themes

-- 7. UPGRADE: if you already created profiles before background_image_url existed, run:
-- alter table public.profiles add column if not exists background_image_url text not null default '';
