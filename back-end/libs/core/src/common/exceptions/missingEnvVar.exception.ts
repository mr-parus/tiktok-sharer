import { EnvVar } from '@libs/core/config/enums/envVar.enum';
import { BaseException, BaseExceptionParams } from './base.exception';

export interface MissingEnvVarExceptionParams extends BaseExceptionParams {
  envVar: EnvVar;
}

export class MissingEnvVarException extends BaseException<MissingEnvVarExceptionParams> {
  getMessage(): string {
    return `Missing environment variable "${this.params.envVar}"`;
  }
}
