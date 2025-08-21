import { PaginationQuery, PaginationResult } from '../../../common';
import { TableItem } from '../types';

export interface ITableRepository {
  getItems(query: PaginationQuery): Promise<PaginationResult<TableItem>>;
  updateSelection(itemIds: number[], selected: boolean): Promise<void>;
  swapItems(itemId1: number, itemId2: number): Promise<void>;
}
