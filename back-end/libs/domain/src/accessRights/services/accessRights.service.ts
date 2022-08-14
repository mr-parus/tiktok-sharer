import { AccessRightsRepository } from '@libs/domain/accessRights/repositories/accessRights.repository';
import { AccessRights } from '@libs/domain/accessRights/schemas/accessRights.schema';
import { AccessRightsCreateParams } from '@libs/domain/accessRights/types/accessRightsCreateParams.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccessRightsService {
  constructor(
    private readonly accessRightsRepository: AccessRightsRepository,
  ) {}

  async createOrUpdate(
    params: AccessRightsCreateParams,
  ): Promise<AccessRights> {
    return this.accessRightsRepository.createOrUpdate(params);
  }

  async findByTikTokUserId(tiktokUserId: string): Promise<AccessRights | null> {
    return this.accessRightsRepository.findByTikTokUserId(tiktokUserId);
  }
}
