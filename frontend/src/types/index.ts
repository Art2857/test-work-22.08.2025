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
