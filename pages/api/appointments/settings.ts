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

  // Get user from auth token (always use getUser on server)
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user?.email?.endsWith('@marialena-pietri.fr')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const { data, error } = await supabase
          .from('appointment_settings')
          .select('*')
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        // If no settings exist, create default settings
        if (!data) {
          const defaultSettings = {
            title: 'Book an Appointment',
            description: 'Schedule a meeting with me',
            email_reminder_enabled: false,
            sms_reminder_enabled: false,
          };

          const { data: newSettings, error: insertError } = await supabase
            .from('appointment_settings')
            .insert([defaultSettings])
            .select()
            .single();

          if (insertError) throw insertError;
          return res.status(200).json(newSettings);
        }

        return res.status(200).json(data);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case 'PUT':
      try {
        const { data, error } = await supabase
          .from('appointment_settings')
          .update({ ...req.body, updated_at: new Date().toISOString() })
          .eq('id', req.body.id)
          .select()
          .single();

        if (error) throw error;
        return res.status(200).json(data);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
