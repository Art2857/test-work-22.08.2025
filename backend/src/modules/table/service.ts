import {
  PaginationQuery,
  PaginationResult,
  validatePagination,
} from '../../common';
import { TableItem, InsertRequest, SelectionRequest } from './types';
import { ITableRepository, ITableService } from './interfaces';
import {
  validateSelectionRequest,
  validateInsertRequest,
} from './validators/table.validators';
import { throwIfErrors } from './utils/validation-helper';

export class TableService implements ITableService {
  constructor(private readonly repository: ITableRepository) {}

  async getItems(query: PaginationQuery): Promise<PaginationResult<TableItem>> {
    const errors = validatePagination(query);
    throwIfErrors(errors);

    return this.repository.getItems(query);
  }

  async updateSelection(request: SelectionRequest): Promise<void> {
    const errors = validateSelectionRequest(request);
    throwIfErrors(errors);

    await this.repository.updateSelection(request.itemIds, request.selected);
  }

  async insertItem(request: InsertRequest): Promise<void> {
    const errors = validateInsertRequest(request);
    throwIfErrors(errors);

    await this.repository.insertItem(request.itemId, request.targetId);
  }
}
