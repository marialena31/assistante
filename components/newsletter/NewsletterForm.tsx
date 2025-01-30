import { useState } from 'react';
import { useToast } from '../ui/Toast';
import { supabase } from '@/utils/supabase';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .schema('api')
        .from('newsletter_subscriptions')
        .insert([{ 
          email,
          is_active: true,
          source: 'footer',
          has_promo: false
        }]);

      if (error) throw error;

      showSuccessToast('Merci pour votre inscription !');
      setEmail('');
    } catch (error: any) {
      console.error('Error:', error);
      showErrorToast(
        error.code === '23505' 
          ? 'Vous êtes déjà inscrit à la newsletter !'
          : 'Une erreur est survenue. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre email"
        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Envoi...' : 'S\'inscrire'}
      </button>
    </form>
  );
}
