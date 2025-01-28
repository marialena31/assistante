import React from 'react';

interface ApiErrorProps {
  statusCode: number;
  message?: string;
  retry?: () => void;
}

export default function ApiError({ statusCode, message, retry }: ApiErrorProps) {
  const defaultMessage = statusCode === 404 
    ? "La ressource demandée n'a pas été trouvée."
    : "Une erreur s'est produite lors de la communication avec le serveur.";

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="text-red-500 mb-4">
        <svg
          className="h-16 w-16 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Erreur {statusCode}
      </h2>
      <p className="text-gray-600 mb-6">
        {message || defaultMessage}
      </p>
      {retry && (
        <button
          onClick={retry}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}
