import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../../types/database';

export const authConfig = {
  auth: {
    flowType: 'pkce',
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth-mlp2024/callback`,
    emailTemplate: {
      resetPassword: {
        subject: 'Réinitialisation de votre mot de passe',
        buttonText: 'Réinitialiser mon mot de passe',
        emailContent: `
          <p>Bonjour,</p>
          <p>Nous avons reçu une demande de réinitialisation de votre mot de passe.</p>
          <p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet email.</p>
          <p>Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous :</p>
        `
      }
    }
  },
  db: {
    schema: 'api'
  },
  cookies: {
    name: 'sb-auth',
    lifetime: 60 * 60 * 24 * 7, // 7 days
    domain: '',
    path: '/',
    sameSite: 'lax'
  }
} as const;
