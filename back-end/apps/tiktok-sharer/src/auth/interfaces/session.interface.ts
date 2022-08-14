import { AccessRights } from '@libs/domain/accessRights/schemas/accessRights.schema';

export interface SessionInterface {
  tiktokAuthState?: string;
  tiktokUserId?: string;
  accessRights?: AccessRights;
}
