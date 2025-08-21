'use client';

import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
  className?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Загрузка...',
  className = 'flex items-center justify-center py-8',
}) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 text-gray-600">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
};
