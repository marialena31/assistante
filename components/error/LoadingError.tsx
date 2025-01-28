import React from 'react';

interface LoadingErrorProps {
  message?: string;
  retry?: () => void;
}

export default function LoadingError({ message = "Une erreur s'est produite lors du chargement.", retry }: LoadingErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <div className="text-red-500 mb-4">
        <svg
          className="h-12 w-12 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <p className="text-gray-700 mb-4">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}
