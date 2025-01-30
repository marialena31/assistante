import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { type EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '../../utils/supabase/client';
import { SECURE_ROUTES } from '../../config/secureRoutes';
import { useToast } from '../../components/ui/Toast';

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();
  const toast = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the recovery token from URL
        const recoveryToken = router.query.token_hash;
        const type = router.query.type;

        if (!recoveryToken || !type) {
          throw new Error('Missing recovery token or type');
        }

        // For password reset flow
        if (type === 'recovery') {
          // First check if we already have a session
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            // If we have a session but no access token, something's wrong
            if (!session.access_token) {
              await supabase.auth.signOut();
              throw new Error('Invalid session state');
            }
            
            // We're already logged in with a valid token, go to reset password
            await router.push('/auth-mlp2024/reset-password');
            return;
          }

          // No session, verify the recovery token
          const { error } = await supabase.auth.verifyOtp({
            token_hash: recoveryToken as string,
            type: type as EmailOtpType,
          });

          if (error) {
            throw error;
          }

          // Token verified, go to reset password
          await router.push('/auth-mlp2024/reset-password');
          return;
        }

        // For signup/email verification flow
        const { error } = await supabase.auth.verifyOtp({
          token_hash: recoveryToken as string,
          type: type as EmailOtpType,
        });

        if (error) {
          throw error;
        }

        // Get returnUrl from query or use default
        const returnUrl = router.query.returnUrl as string || SECURE_ROUTES.ADMIN;
        await router.push(returnUrl);
      } catch (error) {
        console.error('Error in auth callback:', error);
        toast.showErrorToast('Une erreur est survenue lors de la vérification');
        await router.push('/auth-mlp2024/signin?error=Verification failed');
      }
    };

    // Only run if we have query parameters
    if (router.query.token_hash && router.query.type) {
      handleCallback();
    }
  }, [router.query]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}
