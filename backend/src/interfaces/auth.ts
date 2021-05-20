import { RoleAttributes } from "../db/models/role";

export interface JWTPayload {
  userId: number;
  username: string;
  email: string;
  roles: RoleAttributes[];
}