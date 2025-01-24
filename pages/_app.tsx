import type { AppProps } from 'next/app';
import { Roboto, Open_Sans } from 'next/font/google';
import '../styles/globals.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${roboto.variable} ${openSans.variable} font-sans min-h-screen bg-light text-dark`}>
      <Component {...pageProps} />
    </div>
  );
}
