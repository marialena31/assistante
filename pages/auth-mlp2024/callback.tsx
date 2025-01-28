import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '../../utils/supabase/client';
import { SECURE_ROUTES } from '../../config/secureRoutes';

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          router.replace(SECURE_ROUTES.LOGIN);
          return;
        }

        if (user.email?.endsWith('@marialena-pietri.fr')) {
          router.replace(SECURE_ROUTES.ADMIN);
        } else {
          await supabase.auth.signOut();
          router.replace(SECURE_ROUTES.LOGIN);
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        router.replace(SECURE_ROUTES.LOGIN);
      }
    };

    checkUser();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Redirection en cours...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
}
