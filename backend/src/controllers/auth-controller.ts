import express, { Request, Response } from "express";
import User from "../db/models/user";
import Controller from "../interfaces/controller";
import { LoginData } from "../interfaces/login-data";
import bcrypt from "bcrypt";
import expressJwt from "express-jwt";
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
    this.router.get(
      `${this.path}/test`,
      expressJwt({ secret: config.jwtSigningKey, algorithms: ['HS256'] }),
      this.test.bind(this));
  }

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
        const token = jwt.sign(tokenPayload, config.jwtSigningKey);

        res.status(200).json(token);
      } else {
        throw Error("Invalid password");
      }
    } catch (err) {
      res.status(400).json(err);
    }
  }

  private async test(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json("test passed!");
    } catch (err) {
      res.status(400).json(err);
    }
  }

}

export default AuthController;