import { TikTokModule } from '@libs/adapters/tiktok/tiktok.module';
import { ConfigModule } from '@libs/core/config/config.module';
import { AccessRightsModule } from '@libs/domain/accessRights/accessRights.module';
import { Global, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';

@Global()
@Module({
  controllers: [AuthController],
  exports: [AuthService, AuthGuard],
  imports: [ConfigModule, TikTokModule, AccessRightsModule],
  providers: [AuthService, AuthGuard],
})
export class AuthTikTokSharerModule {}
