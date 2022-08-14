import { ConfigModule } from '@libs/core/config/config.module';
import { EnvVar } from '@libs/core/config/enums/envVar.enum';
import { ConfigService } from '@libs/core/config/services/config.service';
import { DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

export function createMongooseModule(): DynamicModule {
  return MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return {
        autoIndex: false,
        uri: configService.getEnv(EnvVar.MONGO_CONNECTION_URI),
        useNewUrlParser: true,
      };
    },
  });
}
