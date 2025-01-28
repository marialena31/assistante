import { NextApiRequest, NextApiResponse } from 'next';
import { createSecureHandler } from '../../../../utils/auth';
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
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, data } = req.body;

    if (!id || !data) {
      return res.status(400).json({ error: 'Id and data are required' });
    }

    const { data: result, error } = await supabaseAdmin
      .from('pages')
      .update(data)
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error updating page:', error);
    return res.status(500).json({ error: error.message });
  }
});
