import { PaginationQuery, PaginationResult } from '../../../common';
import { TableItem, InsertRequest, SelectionRequest } from '../types';

export interface ITableService {
  getItems(query: PaginationQuery): Promise<PaginationResult<TableItem>>;
  updateSelection(request: SelectionRequest): Promise<void>;
  insertItem(request: InsertRequest): Promise<void>;
}
