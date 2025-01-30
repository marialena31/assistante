import { useState, useEffect, Fragment } from 'react';
import { createClient } from '../../utils/supabase/client';
import { useToast } from '../ui/Toast';
import { generatePromoCode } from '../../utils/promoCode';
import { Dialog, Transition } from '@headlessui/react';

const MODAL_COOLDOWN = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
const STORAGE_KEY = 'newsletter_modal_last_shown';

export default function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const { showSuccessToast, showErrorToast } = useToast();
  const supabase = createClient();

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
      // Generate promo code
      const newPromoCode = generatePromoCode(email);

      const { data, error } = await supabase
        .schema('api')
        .from('newsletter_subscriptions')
        .insert([
          {
            email,
            is_active: true,
            source: 'modal',
            has_promo: true,
            promo_code: newPromoCode,
            categories: []
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setPromoCode(newPromoCode);
      showSuccessToast('Merci pour votre inscription !');
      setEmail('');
    } catch (error: any) {
      console.error('Error:', error);
      showErrorToast(error.code === '23505' ? 'Vous êtes déjà inscrit à la newsletter !' : 'Une erreur est survenue. Veuillez réessayer.');
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={() => setIsOpen(false)}>
        <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0">
              <div className="absolute inset-0 bg-gray-500 opacity-75" />
            </div>
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6 sm:align-middle">
              <div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Newsletter
                    </Dialog.Title>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-4">
                        Inscrivez-vous à notre newsletter pour recevoir nos actualités et profiter d'une réduction de 10% sur votre premier devis signé !
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        <strong>Avantages :</strong>
                        <ul className="list-disc list-inside mt-2">
                          <li>Code promo de 10% sur votre premier devis signé</li>
                          <li>Validité du code : 3 mois après réception</li>
                          <li>Code envoyé par email après inscription</li>
                        </ul>
                      </p>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Votre email"
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        />
                        <button
                          type="submit"
                          disabled={loading}
                          className="mt-4 inline-flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:text-sm disabled:opacity-50"
                        >
                          {loading ? 'Inscription...' : 'Obtenir mon code promo'}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                {promoCode && (
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:text-sm"
                    >
                      Fermer
                    </button>
                  </div>
                )}

                {!promoCode && (
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="mt-2 w-full text-sm text-gray-500 hover:text-gray-700"
                  >
                    Non merci
                  </button>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
