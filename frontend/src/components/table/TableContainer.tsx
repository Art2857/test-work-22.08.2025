'use client';

import React from 'react';
import { TableHeader } from './TableHeader';
import { VirtualizedTableContent } from './VirtualizedTableContent';
import type {
  TableItem,
  VirtualItem,
  Virtualizer,
  GhostDragProps,
} from '@/types';

interface TableContainerProps {
  parentRef: React.RefObject<HTMLDivElement | null>;
  virtualizer: Virtualizer;
  virtualItems: VirtualItem[];
  uniqueItems: TableItem[];
  isSelected: (id: number) => boolean;
  onToggleSelection: (id: number, selected: boolean) => void;
  ghostDragProps: GhostDragProps;
  isLoadingMore: boolean;
}

export const TableContainer: React.FC<TableContainerProps> = (props) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <TableHeader />
      <VirtualizedTableContent {...props} />
    </div>
  );
};
