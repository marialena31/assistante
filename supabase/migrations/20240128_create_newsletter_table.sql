-- Create newsletter_subscriptions table in api schema
CREATE TABLE IF NOT EXISTS api.newsletter_subscriptions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_deleted boolean DEFAULT false NOT NULL,
  categories jsonb DEFAULT '[]'::jsonb NOT NULL,
  promo_code_used boolean DEFAULT false,
  last_modal_shown timestamp with time zone
);

-- Set up Row Level Security (RLS)
ALTER TABLE api.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to subscribe (insert)
CREATE POLICY "Allow public to subscribe" ON api.newsletter_subscriptions
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- Allow service role (admin) to do everything
CREATE POLICY "Allow service role full access" ON api.newsletter_subscriptions
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create function to handle unsubscribe
CREATE OR REPLACE FUNCTION api.unsubscribe_newsletter(email_to_unsubscribe text)
RETURNS void AS $$
BEGIN
  UPDATE api.newsletter_subscriptions
  SET is_deleted = true
  WHERE email = email_to_unsubscribe;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
