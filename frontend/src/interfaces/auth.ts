export interface UserInfo {
  userId: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface JWTPayload extends UserInfo {
  iat: number;
}

export interface TokenResponse {
  accessToken: string;
}