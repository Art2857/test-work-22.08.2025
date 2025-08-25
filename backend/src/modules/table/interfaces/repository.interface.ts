import { PaginationQuery, PaginationResult } from '../../../common';
import { TableItem } from '../types';

export interface ITableRepository {
  getItems(query: PaginationQuery): Promise<PaginationResult<TableItem>>;
  updateSelection(itemIds: number[], selected: boolean): Promise<void>;
  insertItem(itemId: number, targetId: number): Promise<void>;
}
