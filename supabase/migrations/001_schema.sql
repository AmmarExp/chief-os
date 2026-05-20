-- =============================================
-- Chief OS — Full Schema + RLS + Triggers
-- Run this in Supabase SQL Editor
-- =============================================

-- PROFILES
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  telegram_chat_id bigint,
  telegram_link_code text,
  telegram_link_code_expires_at timestamptz,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- AGENTS
create table if not exists agents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  role text,
  model text default 'gemini-2.0-flash',
  system_prompt text default '',
  is_chief boolean default false,
  status text default 'idle' check (status in ('idle','running','paused')),
  autonomy integer default 50,
  avatar_emoji text default '🤖',
  created_at timestamptz default now()
);
alter table agents enable row level security;
create policy "Users manage own agents" on agents for all using (auth.uid() = user_id);

-- TASKS
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  agent_id uuid references agents(id) on delete set null,
  title text not null,
  description text,
  priority text default 'medium' check (priority in ('low','medium','high')),
  status text default 'queued' check (status in ('queued','running','done','failed')),
  created_at timestamptz default now(),
  completed_at timestamptz
);
alter table tasks enable row level security;
create policy "Users manage own tasks" on tasks for all using (auth.uid() = user_id);

-- CHIEF MESSAGES
create table if not exists chief_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  direction text not null check (direction in ('in','out')),
  text text not null,
  telegram_message_id bigint,
  created_at timestamptz default now()
);
alter table chief_messages enable row level security;
create policy "Users manage own messages" on chief_messages for all using (auth.uid() = user_id);
alter publication supabase_realtime add table chief_messages;

-- NOTES
create table if not exists notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  content text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table notes enable row level security;
create policy "Users manage own notes" on notes for all using (auth.uid() = user_id);

-- CALENDAR EVENTS
create table if not exists calendar_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  all_day boolean default false,
  color text default '#01696f',
  created_at timestamptz default now()
);
alter table calendar_events enable row level security;
create policy "Users manage own events" on calendar_events for all using (auth.uid() = user_id);

-- TRIGGER: Auto-create profile + default agents on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);

  insert into public.agents (user_id, name, role, is_chief, avatar_emoji, autonomy, system_prompt) values
    (new.id, 'Chief',  'Personal AI Assistant',    true,  '👑', 80, 'You are Chief, a personal AI assistant. Be helpful, concise, and proactive.'),
    (new.id, 'Atlas',  'Researcher & Analyst',      false, '🗺️', 60, 'You are Atlas. You research topics deeply and provide well-structured analysis.'),
    (new.id, 'Quill',  'Writer & Content Creator',  false, '✍️', 60, 'You are Quill. You write clear, engaging, and high-quality content.'),
    (new.id, 'Vega',   'Data & Code Specialist',    false, '⚡', 70, 'You are Vega. You write clean code and analyze data with precision.');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
