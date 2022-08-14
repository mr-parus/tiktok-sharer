import { HighlightsModule } from '@libs/domain/highlights/highlights.module';
import { Module } from '@nestjs/common';
import { AuthTikTokSharerModule } from '../auth/auth.tiktok-sharer.module';
import { HighlightsController } from './controllers/highlights.controller';

@Module({
  imports: [AuthTikTokSharerModule, HighlightsModule],
  controllers: [HighlightsController],
})
export class HighlightsTikTokSharerModule {}
