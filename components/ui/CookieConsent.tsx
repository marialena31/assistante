import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white shadow-strong z-50"
        >
          <div className="container py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-dark mb-2">
                  Ce site utilise des cookies pour améliorer votre expérience de navigation.
                </p>
                <p className="text-sm text-gray-600">
                  En continuant à naviguer sur ce site, vous acceptez notre{' '}
                  <Link href="/politique-confidentialite" className="text-primary hover:text-primary-dark underline">
                    politique de confidentialité
                  </Link>
                  .
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={declineCookies}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-dark transition-colors"
                >
                  Refuser
                </button>
                <button
                  onClick={acceptCookies}
                  className="px-6 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors"
                >
                  Accepter
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
