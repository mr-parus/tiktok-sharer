import { HighlightsModule } from '@libs/domain/highlights/highlights.module';
import { Module } from '@nestjs/common';
import { HighlightsController } from './controllers/highlights.controller';

@Module({
  imports: [HighlightsModule],
  controllers: [HighlightsController],
})
export class HighlightsTikTokSharerModule {}
