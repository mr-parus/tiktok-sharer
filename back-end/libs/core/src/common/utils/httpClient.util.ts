import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

export class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(requestConfig?: AxiosRequestConfig) {
    this.axiosInstance = axios.create(requestConfig);
  }

  async sendRequest<TApiResponseType = unknown>(
    requestConfig: AxiosRequestConfig,
  ): Promise<[AxiosResponse<TApiResponseType>, null] | [null, AxiosError]> {
    try {
      const result = await this.axiosInstance.request<TApiResponseType>(
        requestConfig,
      );

      return [result, null];
    } catch (error) {
      return [null, error as AxiosError];
    }
  }
}
