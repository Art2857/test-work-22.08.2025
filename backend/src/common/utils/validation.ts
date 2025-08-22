import { config } from '../../core/config';
import { ValidationError } from '../types';

export function validatePagination(data: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object') {
    errors.push({ field: 'data', message: 'Invalid data provided' });
    return errors;
  }

  const { page, limit, search } = data as {
    page?: unknown;
    limit?: unknown;
    search?: unknown;
  };

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
