import { TikTokScope } from '@libs/adapters/tiktok/enums/tiktokScope.enum';
import { Equals, IsNotEmpty, IsString } from 'class-validator';

export class TikTokAccessRightsDto {
  @IsString()
  @IsNotEmpty()
  open_id: string;

  @IsString()
  @IsNotEmpty()
  access_token: string;

  @IsString()
  @Equals(TikTokScope.VIDEO_UPLOAD)
  scope: TikTokScope;

  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
