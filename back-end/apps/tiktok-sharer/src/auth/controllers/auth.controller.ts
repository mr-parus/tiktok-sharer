import {
  Controller,
  Get,
  Query,
  Redirect,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { API_ROUTES_PREFIX, INDEX_ROUTE } from '../../app/constants';
import { SessionInterface } from '../interfaces/session.interface';
import { AuthService } from '../services/auth.service';

@Controller(`${API_ROUTES_PREFIX}/v1/auth`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/tiktok')
  @Redirect()
  async authViaTikTok(
    @Session() session: SessionInterface,
  ): Promise<{ url: string }> {
    const csrfToken = await this.authService.generateCsrfToken();
    const redirectUrl = await this.authService.getTikTokAuthPageUrl(csrfToken);

    // Session is stored via express-session (in memory on back-end)
    // https://www.npmjs.com/package/express-session
    session.tiktokAuthState = csrfToken;

    return { url: redirectUrl };
  }

  @Get('/tiktok/redirect')
  @Redirect()
  async handleTikTokAuthCallback(
    @Query() query,
    @Session() session: SessionInterface,
  ) {
    const { tiktokAuthState: expectedCsrf } = session;
    const { error, code, state } = query;

    const receivedCsrf = decodeURIComponent(state);
    const isAuthSuccess = !error && code && expectedCsrf && receivedCsrf;
    const isAuthStateValid = expectedCsrf === receivedCsrf;

    if (isAuthSuccess && isAuthStateValid) {
      const tiktokAccessRightsDto =
        await this.authService.getTikTokAccessRightsByAuthCode(code);

      const { tiktokUserId } =
        await this.authService.createOrUpdateAccessRights(
          tiktokAccessRightsDto,
        );

      session.tiktokUserId = tiktokUserId;
    }

    return { url: INDEX_ROUTE };
  }

  @Get('/jwt')
  async getJwtToken(
    @Session() session: SessionInterface,
  ): Promise<{ jwtToken: string }> {
    const { tiktokUserId } = session;

    if (!tiktokUserId) {
      throw new UnauthorizedException();
    }

    const jwtToken = await this.authService.generateJwtToken({ tiktokUserId });

    return { jwtToken };
  }
}
