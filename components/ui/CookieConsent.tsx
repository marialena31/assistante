import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import cookieContent from '../../content/components/cookie-consent.json';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(cookieContent.storageKey);
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(cookieContent.storageKey, cookieContent.buttons.accept.value);
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem(cookieContent.storageKey, cookieContent.buttons.decline.value);
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
                  {cookieContent.message.main}
                </p>
                <p className="text-sm text-gray-600">
                  {cookieContent.message.details}{' '}
                  <Link href={cookieContent.privacyPolicy.href} className="text-primary hover:text-primary-dark underline">
                    {cookieContent.privacyPolicy.text}
                  </Link>
                  .
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={declineCookies}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-dark transition-colors"
                >
                  {cookieContent.buttons.decline.text}
                </button>
                <button
                  onClick={acceptCookies}
                  className="px-6 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors"
                >
                  {cookieContent.buttons.accept.text}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
