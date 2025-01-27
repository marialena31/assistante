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
      
      {/* Favicon */}
      <link rel="icon" href={headContent.meta.favicon} />
      
      {/* Open Graph */}
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Viewport */}
      <meta name="viewport" content={headContent.meta.viewport} />
      
      {/* Other */}
      <meta name="robots" content={headContent.meta.robots} />
      <meta name="google" content={headContent.meta.google} />
      <link rel="canonical" href={siteUrl} />
    </Head>
  );
}
