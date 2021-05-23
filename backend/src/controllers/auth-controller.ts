import express, { Request, Response } from "express";
import User from "../db/models/user";
import Controller from "../interfaces/controller";
import { LoginData } from "../interfaces/login-data";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../configuration/config";
import { JWTPayload } from "../interfaces/auth";
import Role, { RoleInstance } from "../db/models/role";

class AuthController implements Controller {
  public path = '/auth';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() { 
    this.router.post(`${this.path}/login`, this.login.bind(this));
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
        include: { 
          model: Role,
          attributes: ['name']
        }
      });

      if (!user) throw Error("User doesn't exist");

      const match = await bcrypt.compare(loginData.password, user?.password);

      if (match) {
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
        const token = jwt.sign(
          tokenPayload,
          config.jwtSigningKey,
          {
            algorithm: "HS256",
            expiresIn: "15 minutes"
          }
        );

        res.status(200).json(token);
      } else {
        throw Error("Invalid password");
      }
    } catch (err) {
      res.status(400).json(err);
    }
  }
}

export default AuthController;