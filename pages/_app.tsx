import type { AppProps } from 'next/app';
import { ToastProvider } from '../components/ui/Toast';
import '../styles/globals.css';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import ErrorBoundary from '../components/error/ErrorBoundary';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

/**
 * Main App component that wraps all pages
 * Handles global styles and configurations
 * 
 * Global styles are imported here to ensure they are:
 * 1. Loaded first
 * 2. Available throughout the application
 * 3. Properly processed by Tailwind
 */
export default function App({ Component, pageProps }: AppProps) {
  return (
    // Ensure the root element has access to Tailwind's utility classes
    <ToastProvider>
      <Head>
        <title>Maria Lena Pietri - Assistante Freelance</title>
        <meta name="description" content="Maria Lena Pietri - Assistante Freelance" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
      </Head>
      <main className={inter.className}>
        <div className="antialiased">
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </div>
      </main>
    </ToastProvider>
  );
}
