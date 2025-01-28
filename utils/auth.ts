import { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

export async function verifyAuth(req: NextApiRequest, res: NextApiResponse) {
  // Create server client with cookies
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          res.setHeader('Set-Cookie', value);
        },
        remove(name: string, options: CookieOptions) {
          res.setHeader('Set-Cookie', '');
        },
      },
    }
  );

  // Get session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    throw new Error('No valid session');
  }

  // Create admin client for privileged operations
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    }
  );

  // Verify the user exists
  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(session.access_token);
  
  if (userError || !user) {
    throw new Error('Invalid user');
  }

  return { user, supabaseAdmin };
}

export function createSecureHandler(handler: Function) {
  return async function secureHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { user, supabaseAdmin } = await verifyAuth(req, res);
      return handler(req, res, { user, supabaseAdmin });
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
}
