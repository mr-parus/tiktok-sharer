import { TIKTOK_API_BASE_URL } from '@libs/adapters/tiktok/constants';
import { TikTokAccessRightsDto } from '@libs/adapters/tiktok/dto/tiktokAccessRights.dto';
import { TikTokScope } from '@libs/adapters/tiktok/enums/tiktokScope.enum';
import { TikTokService } from '@libs/adapters/tiktok/servicers/tiktok.service';
import { ConfigModule } from '@libs/core/config/config.module';
import { EnvVar } from '@libs/core/config/enums/envVar.enum';
import { ConfigService } from '@libs/core/config/services/config.service';
import { AccessRightsService } from '@libs/domain/accessRights/services/accessRights.service';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { join } from 'path';
import { INDEX_ROUTE } from '../../app/constants';
import { AUTH_VIA_TIKTOK_CALLBACK_PATH } from '../constants';
import { SessionInterface } from '../interfaces/session.interface';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authController: AuthController;
  let tiktokService: TikTokService;
  let configService: ConfigService;
  let authService: AuthService;

  const tiktokAccessRights: TikTokAccessRightsDto = {
    access_token: '<access_token>',
    open_id: '<open_id>',
    refresh_token: '<refresh_token>',
    scope: TikTokScope.VIDEO_UPLOAD,
  };

  const accessRights = {
    _id: '<id>',
    tiktokUserId: tiktokAccessRights.open_id,
    tiktokAccessToken: tiktokAccessRights.access_token,
    tiktokRefreshToken: tiktokAccessRights.refresh_token,
  };

  const accessRightsServiceMock = {
    createOrUpdate: async () => accessRights,
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [AuthController],
      providers: [
        AuthService,
        TikTokService,
        {
          provide: AccessRightsService,
          useValue: accessRightsServiceMock,
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
    tiktokService = app.get<TikTokService>(TikTokService);
    configService = app.get<ConfigService>(ConfigService);
  });

  describe('authViaTikTok', () => {
    const EXPECTED_CSRF_TOKEN = '<CSRF>';

    beforeEach(() => {
      jest
        .spyOn(authService, 'generateCsrfToken')
        .mockResolvedValue(EXPECTED_CSRF_TOKEN);
    });

    it('should redirect to correct TikTok auth page', async () => {
      const serverBaseUrl = configService.getEnv(EnvVar.SERVER_BASE_URL);
      const tiktokClientKey = configService.getEnv(EnvVar.TIKTOK_CLIENT_KEY);
      const redirectUri = join(serverBaseUrl, AUTH_VIA_TIKTOK_CALLBACK_PATH);
      const session: SessionInterface = {};

      const result = await authController.authViaTikTok(session);
      const url = new URL(result.url);

      expect(`${url.protocol}//${url.host}`).toBe(TIKTOK_API_BASE_URL);
      expect(url.searchParams.get('response_type')).toBe('code');
      expect(url.searchParams.get('scope')).toBe(TikTokScope.VIDEO_UPLOAD);
      expect(url.searchParams.get('client_key')).toBe(tiktokClientKey);
      expect(url.searchParams.get('redirect_uri')).toBe(redirectUri);
      expect(url.searchParams.get('state')).toBe(EXPECTED_CSRF_TOKEN);
    });

    it('should store CSRF token to the session', async () => {
      const session: SessionInterface = {};

      await authController.authViaTikTok(session);

      expect(session.tiktokAuthState).toBe(EXPECTED_CSRF_TOKEN);
    });
  });

  describe('handleTikTokAuthCallback', () => {
    beforeEach(() => {
      jest
        .spyOn(tiktokService, 'getAccessRights')
        .mockResolvedValue(tiktokAccessRights);
    });

    it('should redirect to SPA index', async () => {
      const session: SessionInterface = {};
      const query = {};

      const result = await authController.handleTikTokAuthCallback(
        query,
        session,
      );

      expect(result.url).toBe(INDEX_ROUTE);
    });

    describe('when auth state is invalid (CSRF)', () => {
      it('should not store access rights', async () => {
        const session: SessionInterface = { tiktokAuthState: '<CSRF_A>' };
        const query = { code: '<code>', state: '<CSRF_B>' };

        await authController.handleTikTokAuthCallback(query, session);

        expect(session.tiktokUserId).toBeFalsy();
      });
    });

    describe('when auth is successful', () => {
      it('should store TikTok access rights', async () => {
        const session: SessionInterface = { tiktokAuthState: '<CSRF_A>' };
        const query = { code: '<code>', state: encodeURIComponent('<CSRF_A>') };

        jest.spyOn(accessRightsServiceMock, 'createOrUpdate');

        await authController.handleTikTokAuthCallback(query, session);

        expect(accessRightsServiceMock.createOrUpdate).toBeCalledTimes(1);
      });

      it('should store auth state to session', async () => {
        const session: SessionInterface = { tiktokAuthState: '<CSRF_A>' };
        const query = { code: '<code>', state: encodeURIComponent('<CSRF_A>') };

        await authController.handleTikTokAuthCallback(query, session);

        expect(session.tiktokUserId).toBe(tiktokAccessRights.open_id);
      });
    });
  });

  describe('getJwtToken', () => {
    const EXPECTED_JWT_TOKEN = '<JWT>';

    beforeEach(() => {
      jest
        .spyOn(authService, 'generateJwtToken')
        .mockResolvedValue(EXPECTED_JWT_TOKEN);
    });

    describe('when user has been authenticated via TikTok', () => {
      it('should return JWT token ', async () => {
        const session: SessionInterface = { tiktokUserId: '<tiktokUserId>' };

        const result = await authController.getJwtToken(session);

        expect(result.jwtToken).toBe(EXPECTED_JWT_TOKEN);
      });
    });

    describe('when user is not authenticated', () => {
      it('should respond with 401 ', async () => {
        const session: SessionInterface = {};

        await expect(authController.getJwtToken(session)).rejects.toThrow(
          UnauthorizedException,
        );
      });
    });
  });
});
