import { TikTokModule } from '@libs/adapters/tiktok/tiktok.module';
import { HighlightsService } from '@libs/domain/highlights/services/highlights.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TikTokModule],
  exports: [HighlightsService],
  providers: [HighlightsService],
})
export class HighlightsModule {}
