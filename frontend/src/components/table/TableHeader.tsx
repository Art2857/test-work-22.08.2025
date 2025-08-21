'use client';

import React from 'react';
import { TABLE_STYLES } from '@/constants/table';

interface TableHeaderProps {
  showDragHandle?: boolean;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  showDragHandle = true,
}) => {
  return (
    <div className={TABLE_STYLES.header}>
      {showDragHandle && <div className="w-6" />}

      <div className="w-6" />

      <div className={`w-16 sm:w-20 ${TABLE_STYLES.headerText}`}>Номер</div>

      <div className={`flex-1 ${TABLE_STYLES.headerText}`}>Наименование</div>
    </div>
  );
};
