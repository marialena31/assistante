-- Grant necessary permissions
GRANT USAGE ON SCHEMA api TO anon, authenticated, service_role;
GRANT ALL ON SCHEMA api TO postgres, service_role;

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS api.blog_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT blog_categories_name_key UNIQUE (name)
);

-- Create blog_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS api.blog_posts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    author VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    seo JSONB DEFAULT '{}'::jsonb
);

-- Create blog_posts_categories junction table
CREATE TABLE IF NOT EXISTS api.blog_posts_categories (
    post_id BIGINT REFERENCES api.blog_posts(id) ON DELETE CASCADE,
    category_id BIGINT REFERENCES api.blog_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
);

-- Create blog_tags table
CREATE TABLE IF NOT EXISTS api.blog_tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog_posts_tags junction table
CREATE TABLE IF NOT EXISTS api.blog_posts_tags (
    post_id BIGINT REFERENCES api.blog_posts(id) ON DELETE CASCADE,
    tag_id BIGINT REFERENCES api.blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON api.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON api.blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON api.blog_tags(slug);

-- Add RLS (Row Level Security) policies
ALTER TABLE api.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.blog_posts_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.blog_posts_tags ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public access
CREATE POLICY "Public can view published posts" ON api.blog_posts
    FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

CREATE POLICY "Public can view categories" ON api.blog_categories
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view post categories" ON api.blog_posts_categories
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view tags" ON api.blog_tags
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view post tags" ON api.blog_posts_tags
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Add RLS policies for admin access
CREATE POLICY "Admins can manage all posts" ON api.blog_posts
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' LIKE '%@marialena-pietri.fr');

CREATE POLICY "Admins can manage categories" ON api.blog_categories
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' LIKE '%@marialena-pietri.fr');

CREATE POLICY "Admins can manage post categories" ON api.blog_posts_categories
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' LIKE '%@marialena-pietri.fr');

CREATE POLICY "Admins can manage tags" ON api.blog_tags
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' LIKE '%@marialena-pietri.fr');

CREATE POLICY "Admins can manage post tags" ON api.blog_posts_tags
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' LIKE '%@marialena-pietri.fr');

-- Function to create category if it doesn't exist
CREATE OR REPLACE FUNCTION api.ensure_category_exists(category_name TEXT)
RETURNS BIGINT AS $$
DECLARE
    category_id BIGINT;
    category_slug TEXT;
BEGIN
    -- Convert category name to slug (lowercase, replace spaces with hyphens)
    category_slug := lower(regexp_replace(category_name, '[^a-zA-Z0-9\s]', '', 'g'));
    category_slug := regexp_replace(category_slug, '\s+', '-', 'g');
    
    -- Try to find existing category
    SELECT id INTO category_id FROM api.blog_categories WHERE name = category_name;
    
    -- If category doesn't exist, create it
    IF category_id IS NULL THEN
        INSERT INTO api.blog_categories (name, slug)
        VALUES (category_name, category_slug)
        RETURNING id INTO category_id;
    END IF;
    
    RETURN category_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION api.ensure_category_exists(TEXT) TO authenticated, service_role;

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION api.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Grant table permissions
GRANT ALL ON api.blog_categories TO authenticated, service_role;
GRANT ALL ON api.blog_posts TO authenticated, service_role;
GRANT ALL ON api.blog_posts_categories TO authenticated, service_role;
GRANT ALL ON api.blog_tags TO authenticated, service_role;
GRANT ALL ON api.blog_posts_tags TO authenticated, service_role;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA api TO authenticated, service_role;

-- Grant select permissions to anon for public access
GRANT SELECT ON api.blog_categories TO anon;
GRANT SELECT ON api.blog_posts TO anon;
GRANT SELECT ON api.blog_posts_categories TO anon;
GRANT SELECT ON api.blog_tags TO anon;
GRANT SELECT ON api.blog_posts_tags TO anon;
