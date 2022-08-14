import { AccessRightsRepository } from '@libs/domain/accessRights/repositories/accessRights.repository';
import {
  AccessRights,
  accessRightsSchema,
} from '@libs/domain/accessRights/schemas/accessRights.schema';
import { AccessRightsService } from '@libs/domain/accessRights/services/accessRights.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  exports: [AccessRightsService],
  providers: [AccessRightsService, AccessRightsRepository],
  imports: [
    MongooseModule.forFeature([
      { name: AccessRights.name, schema: accessRightsSchema },
    ]),
  ],
})
export class AccessRightsModule {}
