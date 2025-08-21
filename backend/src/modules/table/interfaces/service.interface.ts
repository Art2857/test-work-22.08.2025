import { PaginationQuery, PaginationResult } from '../../../common';
import { TableItem, SwapRequest, SelectionRequest } from '../types';

export interface ITableService {
  getItems(query: PaginationQuery): Promise<PaginationResult<TableItem>>;
  updateSelection(request: SelectionRequest): Promise<void>;
  swapItems(request: SwapRequest): Promise<void>;
}
