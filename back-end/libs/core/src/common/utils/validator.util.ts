import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { validate } from 'class-validator';
import { ValidatorOptions } from 'class-validator/types/validation/ValidatorOptions';
import { ValidationException } from '../exceptions/validation.exception';

export async function transformOrReject<
  TEncodedType extends object,
  TPlainType,
>(
  classConstructor: ClassConstructor<TEncodedType>,
  plainType: TPlainType,
  validatorOptions?: ValidatorOptions,
): Promise<TPlainType> {
  const instance: TEncodedType = plainToInstance(classConstructor, plainType);
  const [validationError] = await validate(instance, {
    ...validatorOptions,
    stopAtFirstError: true,
  });

  if (validationError) {
    throw ValidationException.ofClassValidatorError(validationError);
  }

  return instanceToPlain(instance) as TPlainType;
}
