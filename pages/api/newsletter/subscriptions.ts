import { NextApiRequest, NextApiResponse } from 'next';
import { createSecureHandler } from '../../../utils/supabase/auth';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../../types/database';

type SecureHandlerContext = {
  user: any;
  supabaseAdmin: ReturnType<typeof createClient<Database>>;
};

export default createSecureHandler(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  { supabaseAdmin }: SecureHandlerContext
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .schema('api')
      .from('newsletter_subscriptions')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return res.status(200).json({ subscriptions: data });
  } catch (error: any) {
    console.error('Error fetching newsletter subscriptions:', error);
    return res.status(500).json({ error: error.message });
  }
});
