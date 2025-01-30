import Link from 'next/link';
import Layout from '../layout/Layout';

interface ErrorStateProps {
  title?: string;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function ErrorState({
  title = "Erreur",
  heading = "Impossible de charger les paramètres de rendez-vous",
  description = "Nous ne pouvons pas charger les paramètres de rendez-vous pour le moment. Veuillez réessayer plus tard ou nous contacter directement.",
  buttonText = "Retour à l'accueil",
  buttonLink = "/"
}: ErrorStateProps) {
  return (
    <Layout
      title={`${title} | Maria-Lena Pietri`}
      description={description}
    >
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl font-bold text-primary mb-4">{title}</h1>
          <h2 className="text-2xl font-semibold text-dark mb-4">
            {heading}
          </h2>
          <p className="text-gray-600 mb-8">
            {description}
          </p>
          <Link
            href={buttonLink}
            className="inline-block bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </Layout>
  );
}
