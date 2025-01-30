-- Create appointment settings table
CREATE TABLE api.appointment_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    photo_url TEXT,
    google_calendar_sync_url TEXT,
    email_reminder_enabled BOOLEAN DEFAULT false,
    sms_reminder_enabled BOOLEAN DEFAULT false,
    email_reminder_template TEXT,
    sms_reminder_template TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create appointment durations table
CREATE TABLE api.appointment_durations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    duration_minutes INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create appointment purposes table
CREATE TABLE api.appointment_purposes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create availability slots table
CREATE TABLE api.availability_slots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE api.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    purpose_id UUID NOT NULL REFERENCES api.appointment_purposes(id),
    message TEXT,
    appointment_type TEXT NOT NULL CHECK (appointment_type IN ('phone', 'video', 'in_person')),
    appointment_date TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL,
    reminders_enabled BOOLEAN DEFAULT true,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'modified')),
    google_calendar_event_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default durations
INSERT INTO api.appointment_durations (duration_minutes) VALUES
    (30),
    (60),
    (90);

-- Insert default purposes
INSERT INTO api.appointment_purposes (title, description) VALUES
    ('Consultation', 'Initial consultation to discuss your needs'),
    ('Follow-up', 'Follow-up meeting to review progress'),
    ('Project Discussion', 'Discuss specific project details');

-- Insert default availability slots (Monday to Friday, 9 AM to 5 PM)
INSERT INTO api.availability_slots (day_of_week, start_time, end_time) 
SELECT 
    day,
    '09:00'::TIME AS start_time,
    '17:00'::TIME AS end_time
FROM generate_series(1, 5) AS day;

-- Insert default settings
INSERT INTO api.appointment_settings (title, description)
VALUES (
    'Book an Appointment',
    'Schedule a meeting with me to discuss your project or requirements.'
);

-- Add Row Level Security (RLS) policies
ALTER TABLE api.appointment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.appointment_durations ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.appointment_purposes ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.appointments ENABLE ROW LEVEL SECURITY;

-- Admin can do everything (using auth.role() instead of admins table)
CREATE POLICY admin_all ON api.appointment_settings FOR ALL TO authenticated USING (auth.role() = 'admin');
CREATE POLICY admin_all ON api.appointment_durations FOR ALL TO authenticated USING (auth.role() = 'admin');
CREATE POLICY admin_all ON api.appointment_purposes FOR ALL TO authenticated USING (auth.role() = 'admin');
CREATE POLICY admin_all ON api.availability_slots FOR ALL TO authenticated USING (auth.role() = 'admin');
CREATE POLICY admin_all ON api.appointments FOR ALL TO authenticated USING (auth.role() = 'admin');

-- Public can read active purposes and durations
CREATE POLICY public_read ON api.appointment_purposes FOR SELECT USING (is_active = true);
CREATE POLICY public_read ON api.appointment_durations FOR SELECT USING (is_active = true);

-- Public can read active availability slots
CREATE POLICY public_read ON api.availability_slots FOR SELECT USING (is_active = true);

-- Public can read appointment settings
CREATE POLICY public_read ON api.appointment_settings FOR SELECT USING (true);

-- Public can create appointments
CREATE POLICY public_create ON api.appointments FOR INSERT WITH CHECK (true);
-- Public can only read their own appointments
CREATE POLICY public_read ON api.appointments FOR SELECT USING (email = auth.jwt() ->> 'email');
