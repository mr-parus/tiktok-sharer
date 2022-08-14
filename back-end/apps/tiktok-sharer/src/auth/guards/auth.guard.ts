import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { getJwtTokenFromAuthHeader } from '../utils/headers.util';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwtToken = getJwtTokenFromAuthHeader(request.headers.authorization);

    if (!jwtToken) {
      throw new UnauthorizedException();
    }

    const accessRights = await this.authService.authByJwtToken(jwtToken);

    if (!accessRights) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
