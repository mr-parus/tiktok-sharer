import { ReadStream } from 'fs';

export type TikTokUploadVideoParams = {
  accessToken: string;
  tiktokUserId: string;
  videoStream: ReadStream;
};
