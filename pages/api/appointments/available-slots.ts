import { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '../../../types/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
      },
      db: {
        schema: 'api'
      }
    }
  );

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { date } = req.query;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date as string)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
  }

  try {
    const queryDate = new Date(date as string);
    const dayOfWeek = queryDate.getDay();

    // Get all availability slots for this day of week
    const { data: availabilitySlots, error: availabilityError } = await supabase
      .from('availability_slots')
      .select('*')
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true);

    if (availabilityError) throw availabilityError;

    // Get all appointments for this date
    const { data: existingAppointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('appointment_date, duration_minutes')
      .gte('appointment_date', `${date}T00:00:00Z`)
      .lt('appointment_date', `${date}T23:59:59Z`)
      .neq('status', 'cancelled');

    if (appointmentsError) throw appointmentsError;

    // Convert existing appointments to blocked time ranges
    const blockedRanges = existingAppointments.map(appointment => {
      const start = new Date(appointment.appointment_date);
      const end = new Date(start.getTime() + appointment.duration_minutes * 60000);
      return { start, end };
    });

    // Generate available time slots
    const availableSlots = availabilitySlots.flatMap(slot => {
      const [startHour, startMinute] = slot.start_time.split(':').map(Number);
      const [endHour, endMinute] = slot.end_time.split(':').map(Number);

      const slotStart = new Date(queryDate);
      slotStart.setHours(startHour, startMinute, 0, 0);

      const slotEnd = new Date(queryDate);
      slotEnd.setHours(endHour, endMinute, 0, 0);

      // Get minimum duration from durations table
      const minDuration = 30; // Default 30 minutes if no durations set

      const slots = [];
      let currentTime = slotStart;

      while (currentTime < slotEnd) {
        const potentialEnd = new Date(currentTime.getTime() + minDuration * 60000);
        
        // Check if this slot overlaps with any blocked ranges
        const isBlocked = blockedRanges.some(range => 
          (currentTime >= range.start && currentTime < range.end) ||
          (potentialEnd > range.start && potentialEnd <= range.end)
        );

        if (!isBlocked) {
          slots.push({
            start: currentTime.toLocaleTimeString('en-US', { hour12: false }),
            end: potentialEnd.toLocaleTimeString('en-US', { hour12: false }),
            available: true
          });
        }

        currentTime = potentialEnd;
      }

      return slots;
    });

    return res.status(200).json(availableSlots);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
