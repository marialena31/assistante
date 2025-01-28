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
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-light shadow-strong"
        >
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-dark flex-grow">
                <p>{cookieContent.message.main}</p>
                <p className="text-sm text-gray-600">
                  {cookieContent.message.details}{' '}
                  <Link href={cookieContent.privacyPolicy.href} className="text-primary hover:underline">
                    {cookieContent.privacyPolicy.text}
                  </Link>
                  .
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={declineCookies}
                  className="btn btn-outline"
                >
                  {cookieContent.buttons.decline.text}
                </button>
                <button
                  onClick={acceptCookies}
                  className="btn btn-primary"
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
