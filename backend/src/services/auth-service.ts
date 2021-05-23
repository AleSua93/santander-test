import { RoleInstance } from "../db/models/role";
import { UserInstance } from "../db/models/user";
import { JWTPayload, TokenPair } from "../interfaces/auth";
import jwt from "jsonwebtoken";
import config from "../configuration/config";

export default class AuthService {
  constructor() {}

  public static async createTokens(user: UserInstance): Promise<TokenPair> {
    // Create payload
    const roles = await user.getRoles();
    const roleNames = roles.map((role: RoleInstance) => {
      return role.name;
    })
    const tokenPayload: JWTPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      isAdmin: roleNames.includes('admin')
    }

    // Sign access token
    const accessToken = jwt.sign(
      tokenPayload,
      config.jwtSigningKey,
      {
        algorithm: "HS256",
        expiresIn: "15 minutes"
      }
    );

    // Sign refresh token
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    const refreshToken = jwt.sign(
      tokenPayload,
      config.jwtSigningKey,
      { algorithm: "HS256" }
    );

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      refreshExpirationDate: expirationDate
    }
  }
}