import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomHead from './Head';
import CookieConsent from '../ui/CookieConsent';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ children, title, description }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <CustomHead title={title} description={description} />
      <Navbar />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
