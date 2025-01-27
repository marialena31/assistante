import Link from 'next/link';
import Layout from '../components/layout/Layout';
import content404 from '../content/pages/404.json';

export default function Custom404() {
  return (
    <Layout
      title="Page non trouvée | Maria-Lena Pietri"
      description="La page que vous recherchez n'existe pas."
    >
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl font-bold text-primary mb-4">{content404.title}</h1>
          <h2 className="text-2xl font-semibold text-dark mb-4">
            {content404.heading}
          </h2>
          <p className="text-gray-600 mb-8">
            {content404.description}
          </p>
          <Link
            href={content404.button.link}
            className="inline-block bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            {content404.button.text}
          </Link>
        </div>
      </div>
    </Layout>
  );
}
