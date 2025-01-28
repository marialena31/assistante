-- Drop existing policies
DROP POLICY IF EXISTS "Allow public to subscribe" ON api.newsletter_subscriptions;
DROP POLICY IF EXISTS "Allow service role full access" ON api.newsletter_subscriptions;
DROP POLICY IF EXISTS "Allow public to subscribe and view" ON api.newsletter_subscriptions;
DROP POLICY IF EXISTS "Allow public to insert unique emails" ON api.newsletter_subscriptions;
DROP POLICY IF EXISTS "Allow public to view" ON api.newsletter_subscriptions;
DROP POLICY IF EXISTS "Allow public to insert" ON api.newsletter_subscriptions;
DROP POLICY IF EXISTS "Allow public to update own subscription" ON api.newsletter_subscriptions;

-- Create policy for viewing subscriptions
CREATE POLICY "Allow public to view" ON api.newsletter_subscriptions
  FOR SELECT
  TO public
  USING (true);

-- Create policy for inserting subscriptions
CREATE POLICY "Allow public to insert" ON api.newsletter_subscriptions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for updating own subscription (unsubscribe)
CREATE POLICY "Allow public to update own subscription" ON api.newsletter_subscriptions
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access" ON api.newsletter_subscriptions
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create a trigger to prevent duplicate emails
CREATE OR REPLACE FUNCTION api.check_duplicate_email()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM api.newsletter_subscriptions 
    WHERE email = NEW.email 
    AND NOT is_deleted
  ) THEN
    RAISE EXCEPTION 'Email already subscribed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS check_duplicate_email_trigger ON api.newsletter_subscriptions;

-- Create the trigger
CREATE TRIGGER check_duplicate_email_trigger
  BEFORE INSERT ON api.newsletter_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION api.check_duplicate_email();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA api TO public;
GRANT ALL ON api.newsletter_subscriptions TO service_role;
GRANT SELECT, INSERT, UPDATE ON api.newsletter_subscriptions TO public;
