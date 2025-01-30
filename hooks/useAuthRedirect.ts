import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '../utils/supabase/client';
import { SECURE_ROUTES } from '../config/secureRoutes';

export function useAuthRedirect() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        // Check if user is authenticated and has correct email domain
        if (!session?.user?.email?.endsWith('@marialena-pietri.fr')) {
          console.log('No valid session or incorrect email domain');
          if (!router.pathname.startsWith('/auth-mlp2024')) {
            const returnUrl = router.pathname;
            localStorage.setItem('returnUrl', returnUrl);
            await router.replace(SECURE_ROUTES.SIGNIN);
          }
          return false;
        }

        // If on auth pages and authenticated, redirect to dashboard
        if (router.pathname.startsWith('/auth-mlp2024') && session) {
          await router.replace(SECURE_ROUTES.ADMIN);
          return true;
        }

        return true;
      } catch (error) {
        console.error('Auth check error:', error);
        if (!router.pathname.startsWith('/auth-mlp2024')) {
          await router.replace(SECURE_ROUTES.SIGNIN);
        }
        return false;
      }
    };

    checkAuth();
  }, [router.pathname]);
}
