import { Global, Module } from '@nestjs/common';
import {
  ConfigModule as NestjsConfigModule,
  ConfigService as NestjsConfigService,
} from '@nestjs/config';
import { ConfigService } from './services/config.service';

@Global()
@Module({
  exports: [ConfigService],
  imports: [NestjsConfigModule.forRoot()],
  providers: [ConfigService, NestjsConfigService],
})
export class ConfigModule {}
