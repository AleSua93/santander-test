import express, { Request, Response } from "express";
import User from "../db/models/user";
import Role from "../db/models/role";
import Controller from "../interfaces/controller";
import { LoginData } from "../interfaces/login-data";
import bcrypt from "bcrypt";
import { TokenResponse } from "../interfaces/auth";
import RefreshToken from "../db/models/refresh-token";
import AuthService from "../services/auth-service";
const { Op } = require("sequelize");

class AuthController implements Controller {
  public path = '/auth';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() { 
    this.router.post(`${this.path}/login`, this.login.bind(this));
    this.router.post(`${this.path}/refresh`, this.refresh.bind(this));
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
   *        description: An access token with user data as payload, and an HttpOnly cookie with a refresh token
   *        Set-Cookie:
   *          schema: 
   *            type: string
   *            example: refreshToken=abcde12345; HttpOnly
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              required:
   *                - accessToken
   *              properties:
   *                accessToken:
   *                  type: string
   *                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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
        // Sign tokens
        const { accessToken, refreshToken, refreshExpirationDate } = 
          await AuthService.getTokens(user);

        // Create refresh token in db
        await user.createRefreshToken({
          token: refreshToken,
          validUntil: refreshExpirationDate
        });

        // Send refresh token as httponly cookie
        res.cookie("refreshToken", refreshToken, {
          secure: process.env.NODE_ENV !== "development",
          httpOnly: true,
          expires: refreshExpirationDate
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


  /**
   * @swagger
   * /auth/refresh:
   *  post:
   *    summary: Refreshes the accessToken using a refreshToken
   *    tags:
   *      - Auth
   *    security: []
   *    parameters:
   *      - in: cookie
   *        name: refreshToken
   *        schema:
   *          type: string
   *        required: true
   *    responses:
   *      '200':
   *        description: A new set of access/refresh tokens
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              required:
   *                - accessToken
   *              properties:
   *                accessToken:
   *                  type: string
   *                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *      '400':
   *        description: Invalid credentials
   *  */  
  private async refresh(req: Request, res: Response): Promise<void> {
    try {
      // Get token from cookies
      const tokenCookie = req.cookies["refreshToken"];
      console.log(`Token cookie: ${tokenCookie}`);
      if (!tokenCookie) throw new Error("Refresh token not present!");

      // Get token from db
      const tokenInstance = await RefreshToken.findOne({
        where: {
          token: tokenCookie,
          validUntil: {
            [Op.gt]: new Date()
          }
        },
        include: {
          model: User,
        }
      });

      if (!tokenInstance) {
        res.status(404).json("Token expired or not found");
        return;
      }

      // Get the user and destroy the token
      const user = await tokenInstance.getUser();
      await tokenInstance.destroy();

      // Sign new tokens
      const { accessToken, refreshToken, refreshExpirationDate } = 
      await AuthService.getTokens(user);

      // Create refresh token in db
      await user.createRefreshToken({
        token: refreshToken,
        validUntil: refreshExpirationDate
      });

      // Send refresh token as httponly cookie
      res.cookie("refreshToken", refreshToken, {
        secure: process.env.NODE_ENV !== "development",
        httpOnly: true,
        expires: refreshExpirationDate
      })

      // Send access token in response
      const tokenResponse: TokenResponse = {
        accessToken: accessToken,
      }
      res.status(200).json(tokenResponse);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }
}

export default AuthController;