import { useState, FormEvent } from 'react';
import { signInWithEmail, resetPassword } from '../../utils/supabase/auth';
import { useToast } from '../../components/ui/Toast';
import Layout from '../../components/layout/Layout';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccessToast, showErrorToast } = useToast();

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
    try {
      if (isResetMode) {
        const { error } = await resetPassword(email);
        if (error) throw error;
        showSuccessToast('Vérifiez votre email pour le lien de réinitialisation');
        setLoading(false);
        return;
      }
  
      const { error: signInError } = await signInWithEmail(email, password);
      if (signInError) throw signInError;

      showSuccessToast('Connexion réussie');
      
      // Let the middleware handle the redirect
      window.location.href = '/secure-dashboard-mlp2024';
  
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message);
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {isResetMode ? 'Réinitialiser le mot de passe' : 'Connexion'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {isResetMode 
                ? "Entrez votre adresse email pour recevoir un lien de réinitialisation"
                : "Connectez-vous avec votre adresse email @marialena-pietri.fr"
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

          <form className="mt-8 space-y-6" onSubmit={handleAuth}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Adresse email
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {!isResetMode && (
                <div>
                  <label htmlFor="password" className="sr-only">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required={!isResetMode}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={() => setIsResetMode(!isResetMode)}
                >
                  {isResetMode
                    ? 'Retour à la connexion'
                    : 'Mot de passe oublié ?'}
                </button>
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
                {loading
                  ? 'Chargement...'
                  : isResetMode
                  ? 'Envoyer le lien de réinitialisation'
                  : 'Se connecter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
