import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../../types/database';
import { SECURE_ROUTES } from '../../config/secureRoutes';

let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export const createClient = (): ReturnType<typeof createBrowserClient<Database>> => {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  supabaseClient = createBrowserClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}${SECURE_ROUTES.AUTH_CALLBACK}` : undefined,
      },
      db: {
        schema: 'api'
      }
    }
  );

  return supabaseClient;
};
