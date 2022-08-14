import { AccessRights } from '@libs/domain/accessRights/schemas/accessRights.schema';
import { AccessRightsCreateParams } from '@libs/domain/accessRights/types/accessRightsCreateParams.type';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AccessRightsRepository {
  constructor(
    @InjectModel(AccessRights.name)
    private readonly accessRightsModel: Model<AccessRights>,
  ) {}

  async createOrUpdate(
    params: AccessRightsCreateParams,
  ): Promise<AccessRights> {
    return this.accessRightsModel.findOneAndUpdate(
      {
        tiktokUserId: params.tiktokUserId,
      },
      {
        $set: {
          tiktokAccessToken: params.tiktokAccessToken,
          tiktokRefreshToken: params.tiktokRefreshToken,
        },
      },
      {
        new: true,
        runValidators: true,
        upsert: true,
      },
    );
  }

  async findByTikTokUserId(tiktokUserId: string): Promise<AccessRights | null> {
    return this.accessRightsModel
      .findOne({ tiktokUserId: tiktokUserId })
      .lean();
  }
}
