import { NextApiRequest, NextApiResponse } from 'next';
import { createSecureHandler } from '../../../../utils/supabase/auth';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../../../types/database';

type SecureHandlerContext = {
  user: any;
  supabaseAdmin: ReturnType<typeof createClient<Database>>;
};

export default createSecureHandler(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  { supabaseAdmin }: SecureHandlerContext
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }

    const { data: result, error } = await supabaseAdmin
      .from('contents')
      .upsert({ ...data, updated_at: new Date().toISOString() })
      .select();

    if (error) {
      throw error;
    }

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error saving content:', error);
    return res.status(500).json({ error: error.message });
  }
});
