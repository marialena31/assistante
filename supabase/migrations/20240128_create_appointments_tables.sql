-- Create appointments tables in api schema
CREATE TABLE IF NOT EXISTS api.appointment_settings (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title text NOT NULL,
    description text,
    photo_url text,
    google_calendar_sync_url text,
    email_reminder_enabled boolean DEFAULT true,
    sms_reminder_enabled boolean DEFAULT true,
    email_reminder_template text,
    sms_reminder_template text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS api.appointment_durations (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    duration_minutes integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS api.appointment_purposes (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS api.appointments (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name text NOT NULL,
    last_name text NOT NULL,
    company_name text NOT NULL,
    email text NOT NULL,
    phone text,
    address text,
    purpose_id uuid REFERENCES api.appointment_purposes(id),
    message text,
    appointment_type text NOT NULL CHECK (appointment_type IN ('phone', 'video', 'in_person')),
    appointment_date timestamp with time zone NOT NULL,
    duration_minutes integer NOT NULL,
    reminders_enabled boolean DEFAULT true,
    status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'modified')),
    google_calendar_event_id text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create availability slots table
CREATE TABLE IF NOT EXISTS api.availability_slots (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time time NOT NULL,
    end_time time NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION api.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_appointment_settings_updated_at
    BEFORE UPDATE ON api.appointment_settings
    FOR EACH ROW
    EXECUTE FUNCTION api.update_updated_at_column();

CREATE TRIGGER update_appointment_purposes_updated_at
    BEFORE UPDATE ON api.appointment_purposes
    FOR EACH ROW
    EXECUTE FUNCTION api.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON api.appointments
    FOR EACH ROW
    EXECUTE FUNCTION api.update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE api.appointment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.appointment_durations ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.appointment_purposes ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.availability_slots ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public to view settings" ON api.appointment_settings
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow public to view durations" ON api.appointment_durations
    FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Allow public to view purposes" ON api.appointment_purposes
    FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Allow public to create appointments" ON api.appointments
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public to view own appointments" ON api.appointments
    FOR SELECT TO public USING (email = current_user);

CREATE POLICY "Allow public to view availability" ON api.availability_slots
    FOR SELECT TO public USING (is_active = true);

-- Create policies for admin access
CREATE POLICY "Allow service role full access to settings" ON api.appointment_settings
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access to durations" ON api.appointment_durations
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access to purposes" ON api.appointment_purposes
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access to appointments" ON api.appointments
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access to availability" ON api.availability_slots
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA api TO public;
GRANT SELECT ON api.appointment_settings TO public;
GRANT SELECT ON api.appointment_durations TO public;
GRANT SELECT ON api.appointment_purposes TO public;
GRANT SELECT, INSERT ON api.appointments TO public;
GRANT SELECT ON api.availability_slots TO public;

-- Grant all permissions to service role
GRANT ALL ON api.appointment_settings TO service_role;
GRANT ALL ON api.appointment_durations TO service_role;
GRANT ALL ON api.appointment_purposes TO service_role;
GRANT ALL ON api.appointments TO service_role;
GRANT ALL ON api.availability_slots TO service_role;
