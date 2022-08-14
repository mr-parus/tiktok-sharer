import { TikTokService } from '@libs/adapters/tiktok/servicers/tiktok.service';
import { ConfigModule } from '@libs/core/config/config.module';
import { AccessRights } from '@libs/domain/accessRights/schemas/accessRights.schema';
import { AccessRightsService } from '@libs/domain/accessRights/services/accessRights.service';
import { HighlightsService } from '@libs/domain/highlights/services/highlights.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth/services/auth.service';
import { HighlightsController } from './highlights.controller';

const HIGHLIGHT_ID = '<highlight_id>';

describe('HighlightsController', () => {
  let highlightsController: HighlightsController;
  let tiktokService: TikTokService;

  const accessRights = {} as AccessRights;
  const accessRightsServiceMock = {
    findByTikTokUserId: jest.fn().mockReturnValue(accessRights),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [HighlightsController],
      providers: [
        AuthService,
        TikTokService,
        HighlightsService,
        {
          provide: AccessRightsService,
          useValue: accessRightsServiceMock,
        },
      ],
    }).compile();

    highlightsController = app.get<HighlightsController>(HighlightsController);
    tiktokService = app.get<TikTokService>(TikTokService);
  });

  describe('shareHighlightToTikTok', () => {
    it('should return TikTok video share id', async () => {
      jest
        .spyOn(tiktokService, 'uploadVideo')
        .mockResolvedValue({ shareId: '<shareId>' });

      const result = await highlightsController.shareHighlightToTikTok(
        HIGHLIGHT_ID,
        { accessRights },
      );

      expect(typeof result.shareId).toBe('string');
    }, 30000);
  });
});
