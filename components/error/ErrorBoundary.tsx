import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useToast } from '../ui/Toast';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryInner extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
          <div className="max-w-lg mx-auto px-4 py-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Une erreur est survenue
            </h2>
            <p className="text-gray-600 mb-6">
              Nous sommes désolés, une erreur inattendue s'est produite. 
              Veuillez rafraîchir la page ou réessayer plus tard.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Rafraîchir la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component to access hooks
export default function ErrorBoundary({ children }: Props) {
  const { showToast } = useToast();

  return (
    <ErrorBoundaryInner>
      {children}
    </ErrorBoundaryInner>
  );
}
