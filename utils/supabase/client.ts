import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '../../types/database'

export const createClient = () => {
  return createBrowserClient<Database, 'api'>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true, // Enable this to let Supabase handle PKCE
        persistSession: true,
        autoRefreshToken: true,
        storage: {
          // Use localStorage to persist code verifier
          getItem: (key) => {
            if (typeof window === 'undefined') return null
            return window.localStorage.getItem(key)
          },
          setItem: (key, value) => {
            if (typeof window === 'undefined') return
            window.localStorage.setItem(key, value)
          },
          removeItem: (key) => {
            if (typeof window === 'undefined') return
            window.localStorage.removeItem(key)
          },
        },
      },
      db: {
        schema: 'api'
      }
    }
  )
}

export const supabase = createClient()

export const updateUserPassword = async (newPassword: string) => {
  const supabase = createClient()
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
};

export const checkUserSession = async () => {
  const supabase = createClient();
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session, error: null };
  } catch (error) {
    return { session: null, error };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  const supabase = createClient();
  try {
    // First sign out to ensure clean state
    await supabase.auth.signOut();

    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Verify session is established
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session) throw new Error('No session established after login');

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signOut = async () => {
  const supabase = createClient();
  try {
    const { error } = await supabase.auth.signOut({
      scope: 'local'
    });
    if (error) throw error;
    
    // Clear any cached data
    window.location.href = '/auth-mlp2024/signin';
    return { error: null };
  } catch (error) {
    return { error };
  }
};
