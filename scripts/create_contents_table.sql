-- Create api schema if it doesn't exist
create schema if not exists api;

-- Create contents table in the api schema
create table if not exists api.contents (
    id serial primary key,
    title text not null,
    content text not null,
    type text not null check (type in ('page', 'component')),
    slug text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(slug, type)
);

-- Create index on slug and type for faster lookups
create index if not exists contents_slug_type_idx on api.contents (slug, type);

-- Enable Row Level Security
alter table api.contents enable row level security;

-- Create policies
create policy "Enable read access for all users" on api.contents
    for select using (true);

create policy "Enable write access for authenticated users only" on api.contents
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
drop trigger if exists handle_updated_at on api.contents;
create trigger handle_updated_at
    before update on api.contents
    for each row
    execute function api.handle_updated_at();
