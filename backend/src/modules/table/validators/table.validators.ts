import { config } from '../../../core/config';
import { ValidationError } from '../../../common/types';
import { SwapRequest, SelectionRequest } from '../types';

export function validateItemId(
  id: number,
  fieldName = 'itemId'
): ValidationError[] {
  if (typeof id !== 'number' || id <= 0 || id > config.tableSize) {
    return [
      {
        field: fieldName,
        message: `${fieldName} must be a valid number between 1 and ${config.tableSize}`,
      },
    ];
  }
  return [];
}

export function validateSelectionRequest(
  request: SelectionRequest
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof request.selected !== 'boolean') {
    errors.push({ field: 'selected', message: 'Selected must be a boolean' });
  }

  if (!Array.isArray(request.itemIds)) {
    errors.push({ field: 'itemIds', message: 'itemIds must be an array' });
    return errors;
  }

  if (request.itemIds.length === 0) {
    errors.push({ field: 'itemIds', message: 'itemIds cannot be empty' });
  }

  if (request.itemIds.length > 1000) {
    errors.push({
      field: 'itemIds',
      message: 'itemIds cannot exceed 1000 items',
    });
  }

  const invalidIds = request.itemIds.filter(
    (id) => typeof id !== 'number' || id <= 0 || id > config.tableSize
  );
  if (invalidIds.length > 0) {
    errors.push({
      field: 'itemIds',
      message: `Invalid item IDs: ${invalidIds.slice(0, 5).join(', ')}${invalidIds.length > 5 ? '...' : ''}`,
    });
  }

  return errors;
}

export function validateSwapRequest(request: SwapRequest): ValidationError[] {
  const errors: ValidationError[] = [];

  errors.push(...validateItemId(request.itemId1, 'itemId1'));
  errors.push(...validateItemId(request.itemId2, 'itemId2'));

  if (request.itemId1 === request.itemId2) {
    errors.push({ field: 'itemId2', message: 'Cannot swap item with itself' });
  }

  return errors;
}
