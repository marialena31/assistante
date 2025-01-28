import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '../../utils/supabase/client';
import { SECURE_ROUTES } from '../../config/secureRoutes';
import { useToast } from '../../components/ui/Toast';

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();
  const { showToast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          router.replace(SECURE_ROUTES.SIGNIN);
          return;
        }

        if (!user.email?.endsWith('@marialena-pietri.fr')) {
          await supabase.auth.signOut();
          showToast('Accès non autorisé', 'error');
          router.replace(SECURE_ROUTES.SIGNIN);
          return;
        }

        showToast('Connexion réussie', 'success');
        router.replace(SECURE_ROUTES.ADMIN);
      } catch (error: any) {
        console.error('Auth callback error:', error);
        showToast(error.message, 'error');
        router.replace(SECURE_ROUTES.SIGNIN);
      }
    };

    handleCallback();
  }, [router]);

  return null;
}
