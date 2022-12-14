import { HighlightsService } from '@libs/domain/highlights/services/highlights.service';
import {
  Controller,
  Get,
  Header,
  Param,
  Post,
  Res,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { API_ROUTES_PREFIX } from '../../app/constants';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { SessionInterface } from '../../auth/interfaces/session.interface';

const HIGHLIGHT_ID_PARAM = 'highlightId';

@Controller(`${API_ROUTES_PREFIX}/v1/highlights`)
export class HighlightsController {
  constructor(private readonly highlightsService: HighlightsService) {}

  @Post(`/:${HIGHLIGHT_ID_PARAM}/share-to-tiktok`)
  @UseGuards(AuthGuard)
  async shareHighlightToTikTok(
    @Param(HIGHLIGHT_ID_PARAM) highlightId: string,
    @Session() session: SessionInterface,
  ): Promise<{ shareId: string }> {
    if (!session.accessRights) {
      throw new UnauthorizedException();
    }

    const { accessRights } = session;
    const { shareId } = await this.highlightsService.shareToTikTokById(
      highlightId,
      accessRights.tiktokUserId,
      accessRights.tiktokAccessToken,
    );

    return { shareId };
  }

  @Get(`/:${HIGHLIGHT_ID_PARAM}`)
  @Header('Content-Type', 'video/mp4')
  async getHighlightSource(
    @Param(HIGHLIGHT_ID_PARAM) highlightId,
    @Res() res: Response,
  ) {
    const videStream = await this.highlightsService.getVideoStreamById(
      highlightId,
    );

    videStream.pipe(res);
  }
}
