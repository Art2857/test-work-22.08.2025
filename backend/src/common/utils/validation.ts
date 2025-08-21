import { config } from '../../core/config';
import { ValidationError } from '../types';

export function validatePagination(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  const { page, limit, search } = data;

  if (typeof page !== 'number' || page < 1) {
    errors.push({ field: 'page', message: 'Page must be a positive number' });
  }

  if (typeof limit !== 'number' || limit < 1 || limit > config.pageSizeLimit) {
    errors.push({
      field: 'limit',
      message: `Limit must be between 1 and ${config.pageSizeLimit}`,
    });
  }

  if (search && (typeof search !== 'string' || search.length > 255)) {
    errors.push({
      field: 'search',
      message: 'Search must be a string (max 255 chars)',
    });
  }

  return errors;
}

export function validateArray(
  field: string,
  value: any,
  maxLength = 1000
): ValidationError[] {
  if (!Array.isArray(value)) {
    return [{ field, message: `${field} must be an array` }];
  }

  if (value.length === 0) {
    return [{ field, message: `${field} cannot be empty` }];
  }

  if (value.length > maxLength) {
    return [{ field, message: `${field} cannot exceed ${maxLength} items` }];
  }

  return [];
}
