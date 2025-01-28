import { useCallback, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useToast } from '../components/ui/Toast';
import {
  AppointmentSettings,
  AppointmentDuration,
  AppointmentPurpose,
  Appointment,
  AvailabilitySlot,
  AppointmentFormData,
  TimeSlot,
} from '../types/appointments';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useAppointments() {
  const [settings, setSettings] = useState<AppointmentSettings | null>(null);
  const [durations, setDurations] = useState<AppointmentDuration[]>([]);
  const [purposes, setPurposes] = useState<AppointmentPurpose[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { showToast } = useToast();

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .schema('api')
        .from('appointment_settings')
        .select('*')
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (err) {
      setError(err as Error);
      showToast('Erreur lors du chargement des paramètres', 'error');
    }
  }, [showToast]);

  const fetchDurations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .schema('api')
        .from('appointment_durations')
        .select('*')
        .eq('is_active', true)
        .order('duration_minutes', { ascending: true });

      if (error) throw error;
      setDurations(data);
    } catch (err) {
      setError(err as Error);
      showToast('Erreur lors du chargement des durées', 'error');
    }
  }, [showToast]);

  const fetchPurposes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .schema('api')
        .from('appointment_purposes')
        .select('*')
        .eq('is_active', true)
        .order('title', { ascending: true });

      if (error) throw error;
      setPurposes(data);
    } catch (err) {
      setError(err as Error);
      showToast('Erreur lors du chargement des motifs', 'error');
    }
  }, [showToast]);

  const fetchAvailability = useCallback(async (date: string, duration: number) => {
    try {
      // First, get the day's availability slots
      const dayOfWeek = new Date(date).getDay();
      const { data: slots, error: slotsError } = await supabase
        .schema('api')
        .from('availability_slots')
        .select('*')
        .eq('day_of_week', dayOfWeek)
        .eq('is_active', true);

      if (slotsError) throw slotsError;

      // Then, get existing appointments for the day
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data: appointments, error: appointmentsError } = await supabase
        .schema('api')
        .from('appointments')
        .select('appointment_date, duration_minutes')
        .gte('appointment_date', startOfDay.toISOString())
        .lte('appointment_date', endOfDay.toISOString())
        .neq('status', 'cancelled');

      if (appointmentsError) throw appointmentsError;

      // Convert slots to available time slots
      const timeSlots: TimeSlot[] = [];
      slots.forEach((slot) => {
        const [startHour, startMinute] = slot.start_time.split(':').map(Number);
        const [endHour, endMinute] = slot.end_time.split(':').map(Number);
        
        let currentTime = new Date(date);
        currentTime.setHours(startHour, startMinute, 0, 0);
        const endTime = new Date(date);
        endTime.setHours(endHour, endMinute, 0, 0);

        while (currentTime.getTime() + duration * 60000 <= endTime.getTime()) {
          const slotEnd = new Date(currentTime.getTime() + duration * 60000);
          
          // Check if slot conflicts with any existing appointment
          const isAvailable = !appointments.some((apt) => {
            const aptStart = new Date(apt.appointment_date);
            const aptEnd = new Date(aptStart.getTime() + apt.duration_minutes * 60000);
            return (
              (currentTime >= aptStart && currentTime < aptEnd) ||
              (slotEnd > aptStart && slotEnd <= aptEnd)
            );
          });

          if (isAvailable) {
            timeSlots.push({
              start: currentTime.toISOString(),
              end: slotEnd.toISOString(),
              available: true,
            });
          }

          currentTime = new Date(currentTime.getTime() + 30 * 60000); // 30-minute intervals
        }
      });

      setAvailableSlots(timeSlots);
    } catch (err) {
      setError(err as Error);
      showToast('Erreur lors du chargement des disponibilités', 'error');
    }
  }, [showToast]);

  const createAppointment = useCallback(async (formData: AppointmentFormData) => {
    try {
      const { data, error } = await supabase
        .schema('api')
        .from('appointments')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      showToast('Rendez-vous créé avec succès', 'success');
      return data as Appointment;
    } catch (err) {
      setError(err as Error);
      showToast('Erreur lors de la création du rendez-vous', 'error');
      throw err;
    }
  }, [showToast]);

  const initialize = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchSettings(),
        fetchDurations(),
        fetchPurposes(),
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchSettings, fetchDurations, fetchPurposes]);

  return {
    settings,
    durations,
    purposes,
    availableSlots,
    loading,
    error,
    initialize,
    fetchAvailability,
    createAppointment,
  };
}
