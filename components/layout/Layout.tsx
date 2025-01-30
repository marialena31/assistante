import Head from 'next/head';
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CookieConsent from '../ui/CookieConsent';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  ogImage?: string;
}

export default function Layout({ children, title = 'Assistant Portfolio', description, ogImage }: LayoutProps) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/secure-dashboard-mlp2024');
  const isAuthPage = router.pathname.startsWith('/auth-mlp2024');

  // If it's an admin page, don't render the standard layout
  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Head>
        <title>{title ? `${title} - Marialena Pietri` : 'Marialena Pietri - Développeuse Web'}</title>
        <meta name="description" content={description || "Portfolio de Marialena Pietri, développeuse web full-stack"} />
        <meta property="og:title" content={title ? `${title} - Marialena Pietri` : 'Marialena Pietri - Développeuse Web'} />
        <meta property="og:description" content={description || "Portfolio de Marialena Pietri, développeuse web full-stack"} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <div className="min-h-screen flex flex-col animate-fade-in">
        {!isAuthPage && <Navbar />}
        <main className={`flex-grow ${!isAuthPage ? 'pt-20' : ''} animate-slide-up`}>
          {children}
        </main>
        {!isAuthPage && <Footer />}
      </div>
      <CookieConsent />
    </>
  );
}
