import Head from 'next/head';
import { ReactNode } from 'react';
import AdminNavbar from './AdminNavbar';
import { useToast } from '../ui/Toast';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title = 'Administration' }: AdminLayoutProps) {
  return (
    <>
      <Head>
        <title>{`${title} - Marialena Pietri`}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AdminNavbar />
        <main className="flex-grow py-6">
          {children}
        </main>
      </div>
    </>
  );
}
