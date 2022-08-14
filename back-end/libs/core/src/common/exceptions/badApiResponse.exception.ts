import { BaseException, BaseExceptionParams } from './base.exception';

export interface BadApiResponseExceptionParams extends BaseExceptionParams {
  api: string;
}

export class BadApiResponseException extends BaseException<BadApiResponseExceptionParams> {
  getMessage(): string {
    return `${this.params.api} responded with an unexpected response`;
  }
}
