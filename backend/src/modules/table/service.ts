import {
  PaginationQuery,
  PaginationResult,
  validatePagination,
  validateArray,
} from '../../common';
import { TableItem, SwapRequest, SelectionRequest } from './types';
import { ITableRepository, ITableService } from './interfaces';

export class TableService implements ITableService {
  constructor(private repository: ITableRepository) {}

  async getItems(query: PaginationQuery): Promise<PaginationResult<TableItem>> {
    const errors = validatePagination(query);
    if (errors.length > 0) {
      const message = errors.map((e) => e.message).join(', ');
      throw new Error(`Validation failed: ${message}`);
    }

    return this.repository.getItems(query);
  }

  async updateSelection(request: SelectionRequest): Promise<void> {
    const errors = validateArray('itemIds', request.itemIds);
    if (errors.length > 0) {
      throw new Error(errors.map((e) => e.message).join(', '));
    }

    if (typeof request.selected !== 'boolean') {
      throw new Error('Selected must be a boolean');
    }

    const invalidIds = request.itemIds.filter(
      (id) => typeof id !== 'number' || id <= 0
    );
    if (invalidIds.length > 0) {
      throw new Error(`Invalid item IDs: ${invalidIds.join(', ')}`);
    }

    await this.repository.updateSelection(request.itemIds, request.selected);
  }

  async swapItems(request: SwapRequest): Promise<void> {
    if (typeof request.itemId1 !== 'number' || request.itemId1 <= 0) {
      throw new Error('Invalid itemId1');
    }

    if (typeof request.itemId2 !== 'number' || request.itemId2 <= 0) {
      throw new Error('Invalid itemId2');
    }

    if (request.itemId1 === request.itemId2) {
      throw new Error('Cannot swap item with itself');
    }

    await this.repository.swapItems(request.itemId1, request.itemId2);
  }
}
