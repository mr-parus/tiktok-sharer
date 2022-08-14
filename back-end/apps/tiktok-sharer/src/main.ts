import { EnvVar } from '@libs/core/config/enums/envVar.enum';
import { ConfigService } from '@libs/core/config/services/config.service';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppTikTokSharerModule } from './app/app.tiktok-sharer.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppTikTokSharerModule, {
    logger: ['error'],
  });

  const configService = app.get<ConfigService>(ConfigService);
  const sessionSecret = configService.getEnv(EnvVar.SERVER_SESSION_SECRET);
  const port = configService.getEnv(EnvVar.SERVER_PORT);

  app.use(
    session({
      resave: false,
      secret: sessionSecret,
      saveUninitialized: false,
    }),
  );

  await app.listen(port);
}

bootstrap().catch(console.error);
