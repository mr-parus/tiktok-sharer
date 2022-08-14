import { Injectable } from '@nestjs/common';
import { ConfigService as NestjsConfigService } from '@nestjs/config';
import { MissingEnvVarException } from '../../common/exceptions/missingEnvVar.exception';
import { EnvVar } from '../enums/envVar.enum';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestjsConfigService) {}

  getEnv(envVar: EnvVar): string {
    const value = this.configService.get(envVar);

    if (value === undefined) {
      throw new MissingEnvVarException({ envVar });
    }

    return value;
  }
}
