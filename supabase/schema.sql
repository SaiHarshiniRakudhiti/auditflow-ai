create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  company text,
  role text,
  team_size int,
  audit jsonb,
  created_at timestamp with time zone default now()
);
