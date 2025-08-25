import type { TableItem, GhostDragProps } from './index';

export interface UseInfiniteTableReturn {
  items: TableItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
  selectedIds: number[];
  toggleSelection: (itemId: number, selected: boolean) => void;
  toggleMultipleSelection: (itemIds: number[], selected: boolean) => void;
  insertItem: (itemId: number, targetId: number) => Promise<void>;
  loadMoreItems: () => Promise<void>;
  refresh: () => Promise<void>;
}

export interface UseSelectionReturn {
  selectedIdsSet: Set<number>;
  isSelected: (id: number) => boolean;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  selectedCount: number;
}

export interface UseTableDragDropReturn {
  isDragging: boolean;
  ghostDragProps: GhostDragProps;
}
