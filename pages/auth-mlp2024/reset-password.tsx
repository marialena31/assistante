import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '../../utils/supabase/client';
import { updatePassword, signOut } from '../../utils/supabase/auth';
import { useToast } from '../../components/ui/Toast';
import Layout from '../../components/layout/Layout';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const router = useRouter();
  const toast = useToast();
  const supabase = createClient();

  // Verify we have a valid session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        // No session at all - redirect to sign in
        if (!session) {
          toast.showErrorToast('Session invalide. Veuillez réessayer la réinitialisation du mot de passe.');
          router.replace('/auth-mlp2024/signin');
          return;
        }

        // Invalid session state
        if (!session.access_token) {
          await signOut();
          toast.showErrorToast('État de session invalide');
          router.replace('/auth-mlp2024/signin');
          return;
        }

        // Wrong email domain
        if (!session.user.email?.endsWith('@marialena-pietri.fr')) {
          await signOut();
          toast.showErrorToast('Seuls les emails @marialena-pietri.fr sont autorisés');
          router.replace('/auth-mlp2024/signin');
          return;
        }

        setIsValidating(false);
      } catch (error) {
        console.error('Error checking session:', error);
        toast.showErrorToast('Une erreur est survenue lors de la vérification de la session');
        router.replace('/auth-mlp2024/signin');
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.showErrorToast('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      toast.showErrorToast('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await updatePassword(password);

      if (error) {
        toast.showErrorToast('Erreur lors de la réinitialisation du mot de passe');
        console.error('Error updating password:', error);
        return;
      }

      toast.showSuccessToast('Mot de passe réinitialisé avec succès. Veuillez vous connecter.');
      
      // Sign out to ensure clean state
      await signOut();
      
      // Redirect to signin page after successful password reset
      router.push('/auth-mlp2024/signin');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.showErrorToast('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (isValidating) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Réinitialisation du mot de passe
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">
                  Nouveau mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Nouveau mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirmer le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
