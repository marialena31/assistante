import Head from 'next/head';

interface HeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export default function CustomHead({
  title = 'Maria-Lena Pietri | Assistante Administrative Freelance',
  description = 'Simplifiez votre quotidien administratif avec une assistante freelance polyvalente. Services de gestion administrative, comptabilité, relation client et plus.',
  keywords = 'assistante administrative, freelance, gestion administrative, comptabilité, relation client, organisation, assistance virtuelle',
  ogImage = '/images/og-image.jpg'
}: HeadProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marialena-pietri.fr';

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Other */}
      <meta name="robots" content="index, follow" />
      <meta name="google" content="notranslate" />
      <link rel="canonical" href={siteUrl} />
    </Head>
  );
}
