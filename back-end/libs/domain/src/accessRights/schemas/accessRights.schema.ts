import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AccessRights extends Document {
  @Prop({ required: true, type: String, unique: true })
  tiktokUserId: string;

  @Prop({ required: true, type: String })
  tiktokAccessToken: string;

  @Prop({ required: true, type: String })
  tiktokRefreshToken: string;
}

export const accessRightsSchema = SchemaFactory.createForClass(AccessRights);
