import { TikTokAccessRightsDto } from '@libs/adapters/tiktok/dto/tiktokAccessRights.dto';
import { TikTokService } from '@libs/adapters/tiktok/servicers/tiktok.service';
import {
  encryptCsrfToken,
  generateCsrfSecret,
  signJwtToken,
  verifyJwtToken,
} from '@libs/core/common/utils/crypto.util';
import { EnvVar } from '@libs/core/config/enums/envVar.enum';
import { ConfigService } from '@libs/core/config/services/config.service';
import { AccessRights } from '@libs/domain/accessRights/schemas/accessRights.schema';
import { AccessRightsService } from '@libs/domain/accessRights/services/accessRights.service';
import { AccessRightsCreateParams } from '@libs/domain/accessRights/types/accessRightsCreateParams.type';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { AUTH_VIA_TIKTOK_CALLBACK_PATH } from '../constants';
import { JwtPayloadInterface } from '../interfaces/jwtPayload.interface';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private readonly serverBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly tiktokService: TikTokService,
    private readonly accessRightsService: AccessRightsService,
  ) {
    this.serverBaseUrl = this.configService.getEnv(EnvVar.SERVER_BASE_URL);
    this.jwtSecret = this.configService.getEnv(EnvVar.SERVER_JWT_SECRET);
  }

  async authByJwtToken(jwtToken: string): Promise<AccessRights | null> {
    try {
      const { tiktokUserId } = await verifyJwtToken<JwtPayloadInterface>(
        jwtToken,
        this.jwtSecret,
      );

      return this.accessRightsService.findByTikTokUserId(tiktokUserId);
    } catch (error) {
      return null;
    }
  }

  async generateCsrfToken(): Promise<string> {
    return encryptCsrfToken(generateCsrfSecret());
  }

  async generateJwtToken(payload: JwtPayloadInterface): Promise<string> {
    const { tiktokUserId } = payload;
    return signJwtToken({ tiktokUserId }, this.jwtSecret);
  }

  async getTikTokAuthPageUrl(csrfToken: string): Promise<string> {
    const callbackUrl = join(this.serverBaseUrl, AUTH_VIA_TIKTOK_CALLBACK_PATH);
    return this.tiktokService.getAuthPageUrl({ csrfToken, callbackUrl });
  }

  async getTikTokAccessRightsByAuthCode(
    authCode: string,
  ): Promise<TikTokAccessRightsDto> {
    return this.tiktokService.getAccessRights(authCode);
  }

  async createOrUpdateAccessRights(
    tiktokAccessRights: TikTokAccessRightsDto,
  ): Promise<AccessRights> {
    const accessRightsCreateParams: AccessRightsCreateParams = {
      tiktokUserId: tiktokAccessRights.open_id,
      tiktokAccessToken: tiktokAccessRights.access_token,
      tiktokRefreshToken: tiktokAccessRights.refresh_token,
    };

    return this.accessRightsService.createOrUpdate(accessRightsCreateParams);
  }
}
