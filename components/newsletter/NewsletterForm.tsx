import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '../ui/Toast';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .schema('api')
        .from('newsletter_subscriptions')
        .insert([
          {
            email,
            is_deleted: false,
            categories: []
          }
        ])
        .select()
        .single();

      if (error) throw error;

      showToast('Merci pour votre inscription !', 'success');
      setEmail('');
    } catch (error: any) {
      console.error('Error:', error);
      showToast(
        error.message === '23505' 
          ? 'Vous êtes déjà inscrit à la newsletter !'
          : 'Une erreur est survenue. Veuillez réessayer.',
        'error'
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
        className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
      >
        {loading ? 'Inscription...' : 'S\'inscrire'}
      </button>
    </form>
  );
}
