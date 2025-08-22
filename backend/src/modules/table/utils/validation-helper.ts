import { ValidationError } from '../../../common/types';

export function formatValidationErrors(errors: ValidationError[]): string {
  return errors.map((e) => e.message).join(', ');
}

export function throwIfErrors(
  errors: ValidationError[],
  prefix = 'Validation failed'
): void {
  if (errors.length > 0) {
    throw new Error(`${prefix}: ${formatValidationErrors(errors)}`);
  }
}
