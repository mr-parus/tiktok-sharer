import { TikTokService } from '@libs/adapters/tiktok/servicers/tiktok.service';
import { resolveInAssetsDir } from '@libs/core/common/utils/path.util';
import { Injectable } from '@nestjs/common';
import { createReadStream, ReadStream } from 'fs';

const VIDEO_PATH = resolveInAssetsDir('video.mp4');

@Injectable()
export class HighlightsService {
  constructor(private readonly tiktokService: TikTokService) {}

  async getVideoStreamById(_highlightId: string): Promise<ReadStream> {
    return createReadStream(VIDEO_PATH);
  }

  async shareToTikTokById(
    highlightId: string,
    tiktokUserId: string,
    accessToken: string,
  ): Promise<{ shareId: string }> {
    const videoStream = await this.getVideoStreamById(highlightId);

    return this.tiktokService.uploadVideo({
      accessToken,
      tiktokUserId,
      videoStream,
    });
  }
}
