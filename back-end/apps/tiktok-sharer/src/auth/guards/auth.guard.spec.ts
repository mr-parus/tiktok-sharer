import { createMock } from '@golevelup/ts-jest';
import { TikTokService } from '@libs/adapters/tiktok/servicers/tiktok.service';
import { ConfigModule } from '@libs/core/config/config.module';
import { AccessRights } from '@libs/domain/accessRights/schemas/accessRights.schema';
import { AccessRightsService } from '@libs/domain/accessRights/services/accessRights.service';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: AuthService;
  let accessRightsService: AccessRightsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        AuthGuard,
        AuthService,
        TikTokService,
        {
          provide: AccessRightsService,
          useValue: {
            findByTikTokUserId: () => null,
          },
        },
      ],
    }).compile();

    authGuard = app.get<AuthGuard>(AuthGuard);
    authService = app.get<AuthService>(AuthService);
    accessRightsService = app.get<AccessRightsService>(AccessRightsService);
  });

  describe('when "Authorization" header is missing', () => {
    it('should respond with 401', async () => {
      const mockExecutionContext = createMock<ExecutionContext>({
        switchToHttp() {
          return {
            getRequest: () => ({
              headers: {},
            }),
          };
        },
      });

      await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('when JWT token is invalid', () => {
    it('should respond with 401', async () => {
      const jwtToken = '<INVALID>';
      const mockExecutionContext = createMock<ExecutionContext>({
        switchToHttp() {
          return {
            getRequest: () => ({
              headers: {
                authorization: `Bearer ${jwtToken}`,
              },
            }),
          };
        },
      });

      jest.spyOn(authService, 'authByJwtToken');

      await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(authService.authByJwtToken).toBeCalledWith(jwtToken);
    });
  });

  describe('when AccessRights are missing', () => {
    it('should respond with 401', async () => {
      const tiktokUserId = '<tiktokUserId>';
      const jwtToken = await authService.generateJwtToken({ tiktokUserId });
      const mockExecutionContext = createMock<ExecutionContext>({
        switchToHttp() {
          return {
            getRequest: () => ({
              headers: {
                authorization: `Bearer ${jwtToken}`,
              },
            }),
          };
        },
      });

      jest
        .spyOn(accessRightsService, 'findByTikTokUserId')
        .mockResolvedValue(null);

      await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(accessRightsService.findByTikTokUserId).toBeCalledWith(
        tiktokUserId,
      );
    });
  });

  describe('when request is authorized', () => {
    it('should return true', async () => {
      const tiktokUserId = '<tiktokUserId>';
      const jwtToken = await authService.generateJwtToken({ tiktokUserId });

      const mockExecutionContext = createMock<ExecutionContext>({
        switchToHttp() {
          return {
            getRequest: () => ({
              headers: {
                authorization: `Bearer ${jwtToken}`,
              },
            }),
          };
        },
      });

      jest
        .spyOn(accessRightsService, 'findByTikTokUserId')
        .mockResolvedValue({ tiktokUserId } as AccessRights);

      const result = await authGuard.canActivate(mockExecutionContext);

      expect(result).toBeTruthy();
      expect(accessRightsService.findByTikTokUserId).toBeCalledWith(
        tiktokUserId,
      );
    });
  });
});
