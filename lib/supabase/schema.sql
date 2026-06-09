-- Run this in your Supabase SQL editor to set up the schema

create table if not exists analysis_sessions (
  id uuid primary key default gen_random_uuid(),
  board_id text not null,
  board_name text not null,
  status text not null default 'pending',
  total_pins int not null default 0,
  analyzed_pins int not null default 0,
  report jsonb,
  timeline jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists pin_analyses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references analysis_sessions(id) on delete cascade,
  pin_id text not null,
  pin_data jsonb not null,
  analysis jsonb not null,
  created_at timestamptz not null default now()
);

create index on pin_analyses(session_id);
create index on pin_analyses(pin_id);

-- Row level security (open for now — add auth later)
alter table analysis_sessions enable row level security;
alter table pin_analyses enable row level security;

create policy "Allow all" on analysis_sessions for all using (true);
create policy "Allow all" on pin_analyses for all using (true);
