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

export interface TableState {
  selectedIds: number[];
  sortOrder: number[];
}

export interface UseTableOptions {
  searchTerm: string;
  page: number;
  limit: number;
}

export interface UseInfiniteTableOptions {
  searchTerm: string;
  pageSize?: number;
}

export interface TableActions {
  refresh: () => void;
  toggleSelection: (itemIds: number[], selected: boolean) => void;
  loadMoreItems: () => void;
  loadSelectedItems: () => void;
  restoreState: () => void;
}

export interface ExtendedTableState extends TableState {
  items: TableItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
}

export type SelectAllState = 'none' | 'partial' | 'all';
