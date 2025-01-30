import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '../../types/database'
import type { EmailOtpType } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

export function createClient() {
  return createBrowserClient<Database, 'api'>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: {
        schema: 'api'
      },
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true
      }
    }
  )
}

/**
 * Get the current user. Use this for server-side code.
 * NEVER use getSession() in server-side code.
 */
export const getUser = async () => {
  const supabase = createClient();
  return await supabase.auth.getUser();
};

/**
 * Get the current session. Only use this for client-side code.
 * For server-side code, use getUser() instead.
 */
export const getSession = async () => {
  const supabase = createClient();
  return await supabase.auth.getSession();
};

// Helper functions for auth operations
export async function signInWithEmail(email: string, password: string) {
  if (!email.endsWith('@marialena-pietri.fr')) {
    throw new Error('Seuls les emails @marialena-pietri.fr sont autorisés')
  }

  const supabase = createClient()
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function signOut() {
  const supabase = createClient()
  return await supabase.auth.signOut()
}

export async function resetPassword(email: string) {
  if (!email.endsWith('@marialena-pietri.fr')) {
    throw new Error('Seuls les emails @marialena-pietri.fr sont autorisés')
  }

  const supabase = createClient()
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth-mlp2024/callback?type=recovery`,
  })
}

export async function updatePassword(password: string) {
  const supabase = createClient()
  return await supabase.auth.updateUser({
    password,
  })
}

export async function signUpWithEmail(email: string, password: string) {
  if (!email.endsWith('@marialena-pietri.fr')) {
    throw new Error('Seuls les emails @marialena-pietri.fr sont autorisés')
  }

  const supabase = createClient()
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth-mlp2024/callback?type=signup`,
    },
  })
}

/**
 * Verify OTP token for password reset or email confirmation
 */
export const verifyOtp = async (token_hash: string, type: EmailOtpType) => {
  const supabase = createClient();
  return await supabase.auth.verifyOtp({
    token_hash,
    type,
  });
};

/**
 * Update user password
 */
export const updateUserPassword = async (password: string) => {
  const supabase = createClient();
  return await supabase.auth.updateUser({ password });
};

/**
 * Creates a secure handler for API routes that requires authentication
 */
export function createSecureHandler(handler: (req: NextApiRequest, res: NextApiResponse, user: any) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user?.email?.endsWith('@marialena-pietri.fr')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      await handler(req, res, user);
    } catch (error) {
      console.error('API error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
