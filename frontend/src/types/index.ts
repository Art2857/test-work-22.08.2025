import React from 'react';

export interface TableItem {
  id: number;
  value: string;
  selected: boolean;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface UseInfiniteTableOptions {
  searchTerm: string;
  pageSize?: number;
}

export interface VirtualItem {
  index: number;
  start: number;
  size: number;
}

export interface Virtualizer {
  getTotalSize: () => number;
}

export interface GhostDragProps {
  isDragging: boolean;
  draggedId: number | null;
  onDragStart: (
    event: React.PointerEvent,
    itemId: number,
    element: HTMLElement
  ) => void;
}
