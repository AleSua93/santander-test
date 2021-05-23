import { RoleAttributes } from "../db/models/role";

export interface JWTPayload {
  userId: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface TokenResponse {
  accessToken: string;
}

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  refreshExpirationDate: Date;
}