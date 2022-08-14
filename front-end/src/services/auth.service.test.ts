import { AxiosError, AxiosResponse } from 'axios';
import { HttpClient } from '../utils/httpClient.util';
import { AuthService } from './auth.service';

jest.mock('./highlights.service');

const EXPECTED_JWT_TOKEN = 'Bearer TOKEN';

describe('AuthService', () => {
  let httpClient: HttpClient;
  let authService: AuthService;

  beforeEach(() => {
    httpClient = new HttpClient();
    authService = new AuthService(httpClient, EXPECTED_JWT_TOKEN);
  });

  describe('getNewJwtToken()', () => {
    describe('when a user is authorised', () => {
      it('should store new JWT token', async () => {
        jest
          .spyOn(httpClient, 'sendRequest')
          .mockResolvedValue([{ data: { jwtToken: EXPECTED_JWT_TOKEN } } as AxiosResponse, null]);

        await authService.getNewJwtToken();

        expect(authService.getJwtToken()).toBe(EXPECTED_JWT_TOKEN);
      });

      it('should set isLoggedIn$.value to true', async () => {
        const mockCallBack = jest.fn();

        authService.isLoggedIn$.subscribe(mockCallBack);

        jest
          .spyOn(httpClient, 'sendRequest')
          .mockResolvedValue([{ data: { jwtToken: EXPECTED_JWT_TOKEN } } as AxiosResponse, null]);

        await authService.getNewJwtToken();

        expect(mockCallBack).toBeCalledWith(true);
      });
    });

    describe('when user is not authorised', () => {
      it('should store null as JWT token', async () => {
        jest.spyOn(httpClient, 'sendRequest').mockResolvedValue([{ data: {} } as AxiosResponse, null]);

        await authService.getNewJwtToken();

        expect(authService.getJwtToken()).toBeNull();
      });

      it('should set isLoggedIn$.value to false', async () => {
        const mockCallBack = jest.fn();

        authService.isLoggedIn$.subscribe(mockCallBack);

        jest.spyOn(httpClient, 'sendRequest').mockResolvedValue([null, new AxiosError()]);

        await authService.getNewJwtToken();

        expect(mockCallBack).toBeCalledWith(false);
      });
    });
  });

  describe('getJwtToken()', () => {
    it('should return', () => {
      expect(authService.getJwtToken()).toBe(EXPECTED_JWT_TOKEN);
    });
  });

  describe('resetJwtToken()', () => {
    it('should return null as a JWT token', () => {
      authService.resetJwtToken();
      expect(authService.getJwtToken()).toBeNull();
    });
  });
});
