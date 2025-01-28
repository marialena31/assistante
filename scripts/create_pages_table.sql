-- Create api schema if it doesn't exist
create schema if not exists api;

-- Create pages table in the api schema
create table if not exists api.pages (
  id uuid default gen_random_uuid() primary key,
  slug text not null,
  path text not null,
  content jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index on slug for faster lookups
create index if not exists pages_slug_idx on api.pages (slug);

-- Enable Row Level Security
alter table api.pages enable row level security;

-- Create policies
create policy "Enable read access for all users" on api.pages
  for select using (true);

create policy "Enable write access for authenticated users only" on api.pages
  for all using (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
create or replace function api.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at timestamp
create trigger handle_updated_at
  before update on api.pages
  for each row
  execute function api.handle_updated_at();
