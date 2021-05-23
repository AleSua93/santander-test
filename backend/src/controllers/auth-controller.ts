import express, { Request, Response } from "express";
import User from "../db/models/user";
import Controller from "../interfaces/controller";
import { LoginData } from "../interfaces/login-data";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../configuration/config";
import { JWTPayload, TokenResponse } from "../interfaces/auth";
import Role, { RoleInstance } from "../db/models/role";
import RefreshToken, { RefreshTokenInstance } from "../db/models/refresh-token";

class AuthController implements Controller {
  public path = '/auth';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() { 
    this.router.post(`${this.path}/login`, this.login.bind(this));
    this.router.get(`${this.path}/refresh`, this.refresh.bind(this));
  }

  /**
   * @swagger
   * /auth/login:
   *  post:
   *    summary: Authenticates the user against the DB credentials
   *    tags:
   *      - Auth
   *    security: []
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - email
   *              - password
   *            properties:
   *              email:
   *                type: string
   *              password:
   *                type: string
   *    responses:
   *      '200':
   *        description: A JWT with user data as payload
   *        content:
   *          text/plain:
   *            schema:
   *              type: string
   *              example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTYyMTcxMjc2OCwiZXhwIjoxNjIxNzEzNjY4fQ.YkncdxSnVmsRMsd1pq7S7dZkRjmYTuG2u1w9hTZd4ec
   *      '400':
   *        description: Invalid credentials
   *  */  
  private async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginData = {
        ...req.body
      };

      const user = await User.findOne({
        where: {
          email: loginData.email
        },
        include: [
          { 
            model: Role,
            attributes: ['name']
          },
          {
            model: RefreshToken
          }
        ]
      });
      if (!user) throw Error("User doesn't exist");

      const match = await bcrypt.compare(loginData.password, user?.password);
      if (match) {
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
        await user.createRefreshToken({
          token: refreshToken,
          validUntil: expirationDate
        });

        // Send refresh token as httponly cookie
        res.cookie("refreshToken", refreshToken, {
          secure: process.env.NODE_ENV !== "development",
          httpOnly: true,
          expires: expirationDate
        })

        // Send access token in response
        const tokenResponse: TokenResponse = {
          accessToken: accessToken,
        }

        res.status(200).json(tokenResponse);
      } else {
        throw Error("Invalid credentials");
      }
    } catch (err) {
      res.status(400).json(err);
    }
  }

  private async refresh(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne({
        include: {
          model: RefreshToken
        }
      });
      let refreshToken: RefreshTokenInstance;
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);

      if (user) {
        refreshToken = await user.createRefreshToken({
          token: "testing",
          validUntil: expirationDate
        });
        console.log(refreshToken);
        res.status(200).json(refreshToken);
      } else {
        res.status(200).json("failed :(");
      }

    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }
}

export default AuthController;