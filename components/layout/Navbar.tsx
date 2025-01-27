import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import navbarContent from '../../content/components/navbar.json';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-soft">
      <div className="container">
        <div className="flex justify-between items-center h-20">
          <Link href={navbarContent.brand.href} className="flex items-center">
            <span className="text-2xl font-bold text-gradient">
              {navbarContent.brand.text}
            </span>
          </Link>
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {navbarContent.navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  router.pathname === item.href
                    ? 'text-primary bg-gray-50'
                    : 'text-dark hover:text-primary hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href={navbarContent.cta.href}
              className="ml-4 bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-soft hover:shadow-strong"
            >
              {navbarContent.cta.text}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="text-dark hover:text-primary p-2 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">
                {mobileMenuOpen ? navbarContent.mobileMenu.closeLabel : navbarContent.mobileMenu.openLabel}
              </span>
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-gray-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container py-4 space-y-1">
              {navbarContent.navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-2 text-base font-medium rounded-lg transition-all ${
                    router.pathname === item.href
                      ? 'text-primary bg-gray-50'
                      : 'text-dark hover:text-primary hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href={navbarContent.cta.href}
                className="block mt-4 px-4 py-2 text-base font-medium text-white bg-accent hover:bg-accent/90 rounded-lg transition-all shadow-soft hover:shadow-strong"
                onClick={() => setMobileMenuOpen(false)}
              >
                {navbarContent.cta.text}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
