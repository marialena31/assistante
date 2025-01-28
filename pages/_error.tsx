import { NextPage } from 'next';
import Layout from '../components/layout/Layout';

interface ErrorProps {
  statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <Layout title="Erreur">
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {statusCode ? `Erreur ${statusCode}` : 'Une erreur est survenue'}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {statusCode === 404
              ? "La page que vous recherchez n'existe pas."
              : "Nous sommes désolés, une erreur s'est produite."}
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </Layout>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
