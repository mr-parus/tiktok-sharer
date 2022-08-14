import { createMongooseModule } from '@libs/adapters/mongo/utils/module.util';
import { PUBLIC_DIR_PATH } from '@libs/core/common/utils/path.util';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthTikTokSharerModule } from '../auth/auth.tiktok-sharer.module';
import { HighlightsTikTokSharerModule } from '../highlights/highlights.tiktok-sharer.module';
import { API_ROUTES_PREFIX } from './constants';

@Module({
  imports: [
    createMongooseModule(),
    AuthTikTokSharerModule,
    HighlightsTikTokSharerModule,
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_DIR_PATH,
      exclude: [`${API_ROUTES_PREFIX}*`],
    }),
  ],
})
export class AppTikTokSharerModule {}
