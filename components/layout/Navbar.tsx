import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { SECURE_ROUTES, isAdminPath } from '../../config/secureRoutes';
import { createBrowserClient } from '@supabase/ssr';
import Image from 'next/legacy/image';

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAdminNav, setShowAdminNav] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    setShowAdminNav(isAuthenticated && isAdminPath(router.pathname));
  }, [isAuthenticated, router.pathname]);

  const checkUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      setIsAuthenticated(!!session?.user);
    } catch (error) {
      console.error('Error checking user session:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/blog', label: 'Blog' },
    { href: '/secteurs', label: 'Secteurs' },
    { href: '/services', label: 'Services' },
    { href: '/tarifs', label: 'Tarifs' },
    { href: '/rendez-vous', label: 'Rendez-vous' },
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ];

  if (router.pathname.startsWith('/auth-mlp2024')) return null;

  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="block relative w-10 h-10">
                <Image
                  src="/images/mp-logo.png"
                  alt="Logo"
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`${
                    router.pathname === href
                      ? 'border-primary text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {label}
                </Link>
              ))}
              {isAuthenticated ? (
                <Link
                  href={SECURE_ROUTES.ADMIN}
                  className={`${
                    isAdminPath(router.pathname)
                      ? 'bg-primary text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  } inline-flex items-center px-4 py-2 rounded-md text-sm font-medium`}
                >
                  Administration
                </Link>
              ) : (null)}
            </div>
          </div>

          <div className="flex items-center">
            {showAdminNav && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                <button
                  onClick={handleLogout}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Déconnexion
                </button>
              </div>
            )}

            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                <span className="sr-only">Ouvrir le menu</span>
                {!isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}
          id="mobile-menu"
        >
          <div className="pt-2 pb-3 space-y-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`${
                  router.pathname === href
                    ? 'bg-primary/5 border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              >
                {label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Link
                href={SECURE_ROUTES.ADMIN}
                className={`${
                  isAdminPath(router.pathname)
                    ? 'bg-primary/5 border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              >
                Administration
              </Link>
            ) : (
              <Link
                href={SECURE_ROUTES.SIGNIN}
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
