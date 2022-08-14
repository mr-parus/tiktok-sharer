import { TikTokAccessRightsDto } from '@libs/adapters/tiktok/dto/tiktokAccessRights.dto';
import { TikTokUploadVideoDto } from '@libs/adapters/tiktok/dto/tiktokUploadVideo.dto';
import { TikTokGetAuthPageUrlParams } from '@libs/adapters/tiktok/types/tiktokGetAuthPageUrlParams.type';
import { TikTokUploadVideoParams } from '@libs/adapters/tiktok/types/tiktokUploadVideoParams.type';
import { BadApiResponseException } from '@libs/core/common/exceptions/badApiResponse.exception';
import { HttpClient } from '@libs/core/common/utils/httpClient.util';
import { transformOrReject } from '@libs/core/common/utils/validator.util';
import { EnvVar } from '@libs/core/config/enums/envVar.enum';
import { ConfigService } from '@libs/core/config/services/config.service';
import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import {
  TIKTOK_API_ACCESS_TOKEN_PATH,
  TIKTOK_API_AUTH_PATH,
  TIKTOK_API_BASE_URL,
  TIKTOK_API_NAME,
  TIKTOK_API_UPLOAD_VIDEO_PATH,
} from '../constants';
import { TikTokScope } from '../enums/tiktokScope.enum';

@Injectable()
export class TikTokService {
  private readonly clientKey: string;
  private readonly clientSecret: string;
  private readonly httpClient: HttpClient;

  constructor(private readonly configService: ConfigService) {
    this.httpClient = new HttpClient({ baseURL: TIKTOK_API_BASE_URL });
    this.clientKey = this.configService.getEnv(EnvVar.TIKTOK_CLIENT_KEY);
    this.clientSecret = this.configService.getEnv(EnvVar.TIKTOK_CLIENT_SECRET);
  }

  async getAccessRights(authCode: string): Promise<TikTokAccessRightsDto> {
    const [response, responseError] =
      await this.httpClient.sendRequest<TikTokAccessRightsDto>({
        url: TIKTOK_API_ACCESS_TOKEN_PATH,
        method: 'POST',
        params: {
          code: authCode,
          client_secret: this.clientSecret,
          client_key: this.clientKey,
          grant_type: 'authorization_code',
        },
      });

    if (responseError) {
      throw new BadApiResponseException({
        api: TIKTOK_API_NAME,
        originalError: responseError,
      });
    }

    return transformOrReject(TikTokAccessRightsDto, response.data);
  }

  getAuthPageUrl(params: TikTokGetAuthPageUrlParams): string {
    const { csrfToken, callbackUrl } = params;
    const url = new URL(TIKTOK_API_AUTH_PATH, TIKTOK_API_BASE_URL);

    url.searchParams.append('client_key', this.clientKey);
    url.searchParams.append('redirect_uri', callbackUrl);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', TikTokScope.VIDEO_UPLOAD);
    url.searchParams.append('state', csrfToken);

    return url.toString();
  }

  async uploadVideo({
    tiktokUserId,
    accessToken,
    videoStream,
  }: TikTokUploadVideoParams): Promise<{ shareId: string }> {
    const form = new FormData();
    form.append('video', videoStream, 'video.mp4');

    const [response, responseError] = await this.httpClient.sendRequest<{
      data: TikTokUploadVideoDto;
    }>({
      url: TIKTOK_API_UPLOAD_VIDEO_PATH,
      method: 'POST',
      headers: form.getHeaders(),
      data: form,
      params: {
        open_id: tiktokUserId,
        access_token: accessToken,
      },
    });

    if (responseError || !response?.data?.data?.share_id) {
      throw new BadApiResponseException({
        api: TIKTOK_API_NAME,
        originalError: responseError || undefined,
      });
    }

    return {
      shareId: response.data.data.share_id,
    };
  }
}
