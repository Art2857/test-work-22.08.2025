export interface PaginationQuery {
  page: number;
  limit: number;
  search?: string;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
