import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TikTokUploadVideoDto {
  @IsString()
  @IsNotEmpty()
  share_id: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  error_msg: string;
}
