'use client';

import React from 'react';

interface EmptyStateProps {
  searchTerm: string;
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  searchTerm,
  title = 'Ничего не найдено',
  description = 'Попробуйте изменить поисковый запрос.',
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-8 text-center">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500">
            По запросу &quot;{searchTerm}&quot; результатов не найдено.
            <br />
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
