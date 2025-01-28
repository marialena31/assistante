import { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md mx-auto pointer-events-none px-4">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              mb-3 p-4 rounded-lg shadow-lg text-white 
              transform transition-all duration-300 ease-in-out
              animate-toast-slide-down backdrop-blur-sm
              ${
                toast.type === 'error' ? 'bg-red-500/95 shadow-red-500/20' :
                toast.type === 'success' ? 'bg-green-500/95 shadow-green-500/20' :
                toast.type === 'warning' ? 'bg-yellow-500/95 shadow-yellow-500/20' :
                'bg-blue-500/95 shadow-blue-500/20'
              }
            `}
          >
            <div className="flex items-center justify-center text-center font-medium">
              {toast.message}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
