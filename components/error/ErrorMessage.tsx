import React from 'react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export default function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className={`text-red-500 text-sm mt-1 ${className}`}>
      {message}
    </div>
  );
}
