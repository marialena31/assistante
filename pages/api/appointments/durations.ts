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
          .from('appointment_durations')
          .select('*')
          .order('duration_minutes', { ascending: true });

        if (error) throw error;

        // If no durations exist, create default durations
        if (data.length === 0) {
          const defaultDurations = [
            { duration_minutes: 30 },
            { duration_minutes: 60 },
            { duration_minutes: 90 },
          ];

          const { data: newDurations, error: insertError } = await supabase
            .from('appointment_durations')
            .insert(defaultDurations)
            .select();

          if (insertError) throw insertError;
          return res.status(200).json(newDurations);
        }

        return res.status(200).json(data);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case 'POST':
      try {
        const { data, error } = await supabase
          .from('appointment_durations')
          .insert([req.body])
          .select()
          .single();

        if (error) throw error;
        return res.status(201).json(data);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
