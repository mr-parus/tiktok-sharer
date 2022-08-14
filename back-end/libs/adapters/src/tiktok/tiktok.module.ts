import { ConfigModule } from '@libs/core/config/config.module';
import { Module } from '@nestjs/common';
import { TikTokService } from './servicers/tiktok.service';

@Module({
  imports: [ConfigModule],
  exports: [TikTokService],
  providers: [TikTokService],
})
export class TikTokModule {}
