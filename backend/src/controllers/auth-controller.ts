import express, { Request, Response } from "express";
import User from "../db/models/user";
import Controller from "../interfaces/controller";
import { LoginData } from "../interfaces/login-data";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../configuration/config";
import { TokenResponse } from "../interfaces/authentication";

class AuthController implements Controller {
  public path = '/auth';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.login.bind(this));
  }

  private async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginData = {
        ...req.body
      };

      const user = await User.findOne({
        where: {
          email: loginData.email
        }
      });

      if (!user) {
        throw Error("User doesn't exist");
      }

      const match = await bcrypt.compare(loginData.password, user?.password);
      console.log(match);
      if (match) {
        const token = jwt.sign(user.toJSON(), config.jwtSigningKey);
        const roles = user.getRoles();
        console.log('hello');
        console.log(roles);

        // const tokenResponse: TokenResponse = {
        //   accessToken: token,
        //   userInfo: {
        //     id: user.id,
        //     username: user.username,
        //     email: user.email,
        //     role: "hello"
        //   }
        // }

        res.status(200).json(roles);
      } else {
        throw Error("Invalid password");
      }
    } catch (err) {
      res.status(400).json(err);
    }
  }
}

export default AuthController;