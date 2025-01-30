import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import { createClient } from '../../utils/supabase/client';
import { SECURE_ROUTES } from '../../config/secureRoutes';
import { useToast } from '../../components/ui/Toast';
import { PasswordStrengthMeter } from '../../components/auth/PasswordStrengthMeter';
import { validatePassword } from '../../utils/auth/passwordValidation';

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'request' | 'reset'>('request');
  const supabase = createClient();
  const { showSuccessToast, showErrorToast } = useToast();

  useEffect(() => {
    const checkResetMode = async () => {
      // Check if we're in recovery mode from the query parameters
      const { type } = router.query;
      if (type === 'recovery') {
        setMode('reset');
        // Get the current user to pre-fill email
        const { data: { user }, error } = await supabase.auth.getUser();
        if (user?.email) {
          setEmail(user.email);
        }
      }
    };

    if (router.isReady) {
      checkResetMode();
    }
  }, [router.isReady]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!email.endsWith('@marialena-pietri.fr')) {
        throw new Error("Seuls les utilisateurs avec une adresse email @marialena-pietri.fr peuvent réinitialiser leur mot de passe");
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth-mlp2024/reset-password`
      });

      if (error) throw error;

      showSuccessToast(
        'Si cette adresse email existe dans notre système, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.'
      );
      setEmail('');
    } catch (error: any) {
      setError(error.message);
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      showErrorToast('Les mots de passe ne correspondent pas');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      showErrorToast(passwordValidation.message);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      showSuccessToast('Mot de passe mis à jour avec succès. Veuillez vous connecter avec votre nouveau mot de passe.');
      
      // Sign out and redirect to login
      await supabase.auth.signOut();
      router.push(SECURE_ROUTES.SIGNIN);
    } catch (error: any) {
      setError(error.message);
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Réinitialisation du mot de passe | Administration">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {mode === 'request' ? 'Demande de réinitialisation' : 'Réinitialiser votre mot de passe'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {mode === 'request' 
                ? 'Entrez votre adresse email pour recevoir un lien de réinitialisation'
                : 'Choisissez un nouveau mot de passe sécurisé'
              }
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {mode === 'request' ? (
            <form className="mt-8 space-y-6" onSubmit={handleRequestReset}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
                </button>
              </div>
            </form>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleReset}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Nouveau mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
                <PasswordStrengthMeter password={password} />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {loading ? 'Chargement...' : 'Réinitialiser le mot de passe'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
