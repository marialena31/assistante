import { Fragment, useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createClient } from '../../utils/supabase/client';
import { SECURE_ROUTES } from '../../config/secureRoutes';
import { useToast } from '../ui/Toast';

export default function AdminNavbar() {
  const router = useRouter();
  const supabase = createClient();
  const { showToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (!session) {
          if (!router.pathname.startsWith('/auth-mlp2024')) {
            const returnUrl = router.pathname;
            localStorage.setItem('returnUrl', returnUrl);
            await router.push(SECURE_ROUTES.SIGNIN);
          }
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error: any) {
        console.error('Auth error:', error);
        showToast('Erreur', 'Erreur d\'authentification', 'error');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      showToast('Succès', 'Déconnexion réussie', 'success');
      await router.push(SECURE_ROUTES.SIGNIN);
    } catch (error: any) {
      showToast('Erreur', error.message || 'Erreur lors de la déconnexion', 'error');
    }
  };

  const menuItems = [
    { href: SECURE_ROUTES.ADMIN, label: 'Dashboard' },
    { href: SECURE_ROUTES.ADMIN_BLOG, label: 'Articles' },
    { href: SECURE_ROUTES.ADMIN_CATEGORIES, label: 'Catégories' },
    { href: SECURE_ROUTES.ADMIN_APPOINTMENTS, label: 'Rendez-vous' },
    { href: SECURE_ROUTES.ADMIN_NEWSLETTER, label: 'Newsletter' },
    { href: SECURE_ROUTES.ADMIN_PROFILE, label: 'Profil' },
  ];

  if (isLoading || router.pathname.startsWith('/auth-mlp2024') || !isAuthenticated) return null;

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href={SECURE_ROUTES.ADMIN} className="text-xl font-bold text-primary">
                    Administration
                  </Link>
                </div>

                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`${
                        router.asPath.startsWith(item.href)
                          ? 'border-primary text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button
                  onClick={handleLogout}
                  className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark"
                >
                  Déconnexion
                </button>
              </div>

              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${
                    router.asPath.startsWith(item.href)
                      ? 'bg-primary/5 border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Déconnexion
              </button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
