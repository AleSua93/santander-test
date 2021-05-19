import { RoleAttributes } from "../db/models/role";

interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: RoleAttributes;
}

export interface TokenResponse {
  accessToken: string;
  userInfo: UserInfo;
}