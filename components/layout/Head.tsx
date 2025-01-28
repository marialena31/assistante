import Head from 'next/head';
import headContent from '../../content/components/head.json';

interface HeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export default function CustomHead({
  title = headContent.defaults.title,
  description = headContent.defaults.description,
  keywords = headContent.defaults.keywords,
  ogImage = headContent.defaults.ogImage
}: HeadProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marialena-pietri.fr';

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* OpenGraph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title} />
      
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Favicon */}
      <link rel="icon" href={headContent.meta.favicon} />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#ffffff" />
      
      {/* Viewport */}
      <meta name="viewport" content={headContent.meta.viewport} />
      
      {/* Other */}
      <meta name="robots" content={headContent.meta.robots} />
      <meta name="google" content={headContent.meta.google} />
      <link rel="canonical" href={siteUrl} />
    </Head>
  );
}
