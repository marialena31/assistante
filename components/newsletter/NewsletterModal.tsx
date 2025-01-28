import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '../ui/Toast';

const MODAL_COOLDOWN = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
const STORAGE_KEY = 'newsletter_modal_last_shown';

export default function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        const lastShown = localStorage.getItem(STORAGE_KEY);
        const now = new Date().getTime();

        if (!lastShown || now - parseInt(lastShown) >= MODAL_COOLDOWN) {
          setIsOpen(true);
          localStorage.setItem(STORAGE_KEY, now.toString());
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

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
            categories: [],
            promo_code_used: false
          }
        ])
        .select()
        .single();

      if (error) throw error;

      showToast('Merci pour votre inscription ! Voici votre code promo : WELCOME10', 'success');
      setEmail('');
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error:', error);
      showToast(
        error.code === '23505' 
          ? 'Vous êtes déjà inscrit à la newsletter !'
          : 'Une erreur est survenue. Veuillez réessayer.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        
        <h2 className="text-2xl font-bold mb-4">Ne partez pas si vite !</h2>
        <p className="text-gray-600 mb-6">
          Inscrivez-vous à notre newsletter et recevez un code promo de 10% sur votre première commande !
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            {loading ? 'Inscription...' : 'Recevoir mon code promo'}
          </button>
        </form>
      </div>
    </div>
  );
}
