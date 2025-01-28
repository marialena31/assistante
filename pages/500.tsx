import Link from 'next/link';
import Layout from '../components/layout/Layout';

export default function Custom500() {
  return (
    <Layout
      title="Erreur serveur | Maria-Lena Pietri"
      description="Une erreur serveur s'est produite."
    >
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl font-bold text-primary mb-4">500</h1>
          <h2 className="text-2xl font-semibold text-dark mb-4">
            Erreur serveur
          </h2>
          <p className="text-gray-600 mb-8">
            Nous sommes désolés, une erreur serveur s'est produite. Notre équipe technique a été notifiée et travaille à résoudre le problème.
          </p>
          <Link
            href="/"
            className="inline-block bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </Layout>
  );
}
