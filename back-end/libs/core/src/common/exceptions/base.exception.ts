export interface BaseExceptionParams {
  originalError?: Error;
}

export abstract class BaseException<
  TExceptionParams extends BaseExceptionParams,
> extends Error {
  constructor(protected readonly params: TExceptionParams) {
    super();

    this.name = new.target.name;
    this.message = this.getMessage();
  }

  getMessage() {
    const { originalError } = this.params;

    return originalError instanceof Error
      ? originalError.message
      : 'Exception occurred';
  }
}
