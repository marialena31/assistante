import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import { createClient } from '../../utils/supabase/client';
import { SECURE_ROUTES } from '../../config/secureRoutes';
import { useToast } from '../../components/ui/Toast';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const supabase = createClient();
  const { showToast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email?.endsWith('@marialena-pietri.fr')) {
        router.push(SECURE_ROUTES.ADMIN);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isResetMode) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}${SECURE_ROUTES.AUTH_CALLBACK}`,
        });
        if (error) throw error;
        showToast('Vérifiez votre email pour le lien de réinitialisation', 'success');
        setLoading(false);
        return;
      }

      if (!email.endsWith('@marialena-pietri.fr')) {
        throw new Error("Seuls les utilisateurs avec une adresse email @marialena-pietri.fr peuvent se connecter à cette interface");
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      if (data?.user?.email?.endsWith('@marialena-pietri.fr')) {
        showToast('Connexion réussie', 'success');
      } else {
        await supabase.auth.signOut();
        throw new Error("Accès non autorisé");
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message);
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Connexion | Administration">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {isResetMode ? 'Réinitialiser le mot de passe' : 'Connexion à l\'administration'}
            </h2>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleAuth}>
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
                <p className="font-medium">Erreur:</p>
                <p>{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
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

            {!isResetMode && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
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
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {loading ? 'Chargement...' : (isResetMode ? 'Envoyer le lien' : 'Se connecter')}
              </button>
            </div>

            <div className="text-sm text-center">
              <button
                type="button"
                onClick={() => setIsResetMode(!isResetMode)}
                className="font-medium text-primary hover:text-primary-dark"
              >
                {isResetMode ? 'Retour à la connexion' : 'Mot de passe oublié ?'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
