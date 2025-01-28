-- Create blog categories table
CREATE TABLE api.blog_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create blog posts table
CREATE TABLE api.blog_posts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    category_id BIGINT REFERENCES api.blog_categories(id),
    author_id UUID REFERENCES auth.users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'draft', -- draft, published, scheduled
    published_at TIMESTAMP WITH TIME ZONE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT valid_status CHECK (status IN ('draft', 'published', 'scheduled'))
);

-- Create RLS policies
ALTER TABLE api.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies for blog_categories
CREATE POLICY "Enable read access for all users" ON api.blog_categories
    FOR SELECT USING (true);

CREATE POLICY "Enable write access for authenticated users only" ON api.blog_categories
    FOR ALL USING (auth.role() = 'authenticated');

-- Policies for blog_posts
CREATE POLICY "Public can view published posts" ON api.blog_posts
    FOR SELECT USING (status = 'published' AND published_at <= NOW());

CREATE POLICY "Authenticated users can manage all posts" ON api.blog_posts
    FOR ALL USING (auth.role() = 'authenticated');

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_categories_updated_at
    BEFORE UPDATE ON api.blog_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON api.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
