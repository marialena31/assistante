import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }

    const { data, error } = await supabase
      .schema('api')
      .from('newsletter_subscriptions')
      .update({ is_deleted: true })
      .eq('email', email)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Email non trouvé' });
      }
      throw error;
    }

    return res.status(200).json({ message: 'Désinscription réussie' });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return res.status(500).json({ error: 'Erreur lors de la désinscription' });
  }
}
