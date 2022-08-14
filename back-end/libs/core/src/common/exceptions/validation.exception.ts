import { ValidationError as ClassValidatorValidationError } from 'class-validator';
import { BaseException, BaseExceptionParams } from './base.exception';

export interface ValidationExceptionParams extends BaseExceptionParams {
  reason?: string;
  received: Record<string, unknown>;
}

export class ValidationException extends BaseException<ValidationExceptionParams> {
  static ofClassValidatorError(
    error: ClassValidatorValidationError,
  ): ValidationException {
    const { property, value } = error;

    return new ValidationException({
      received: { [property]: value },
    });
  }

  getMessage(): string {
    const entries = Object.entries(this.params.received).map(
      ([key, value]) => `value of "${key}" is ${JSON.stringify(value)}`,
    );
    return `${entries.join(', and ')}`;
  }
}
