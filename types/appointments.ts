export interface AppointmentSettings {
  id: string;
  title: string;
  description: string | null;
  photo_url: string | null;
  google_calendar_sync_url: string | null;
  email_reminder_enabled: boolean;
  sms_reminder_enabled: boolean;
  email_reminder_template: string | null;
  sms_reminder_template: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppointmentDuration {
  id: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
}

export interface AppointmentPurpose {
  id: string;
  title: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  purpose_id: string;
  message: string | null;
  appointment_type: 'phone' | 'video' | 'in_person';
  appointment_date: string;
  duration_minutes: number;
  reminders_enabled: boolean;
  status: 'confirmed' | 'cancelled' | 'modified';
  google_calendar_event_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AvailabilitySlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
}

export interface AppointmentFormData {
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  phone?: string;
  address?: string;
  purpose_id: string;
  message?: string;
  appointment_type: 'phone' | 'video' | 'in_person';
  appointment_date: string;
  duration_minutes: number;
  reminders_enabled: boolean;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}
