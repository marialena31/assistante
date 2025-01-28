-- Move contents table from api schema to public schema
CREATE TABLE IF NOT EXISTS public.contents (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('page', 'component')),
    slug TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(slug, type)
);

-- Copy data from api.contents to public.contents if api.contents exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'api' AND table_name = 'contents') THEN
        INSERT INTO public.contents (title, content, type, slug, created_at, updated_at)
        SELECT title, content, type, slug, created_at, updated_at
        FROM api.contents;
    END IF;
END $$;

-- Drop the old table if it exists
DROP TABLE IF EXISTS api.contents;

-- Enable Row Level Security
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.contents
    FOR SELECT USING (true);

CREATE POLICY "Enable write access for authenticated users only" ON public.contents
    FOR ALL USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at timestamp
DROP TRIGGER IF EXISTS handle_updated_at ON public.contents;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.contents
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
