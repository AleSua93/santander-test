import express, { Request, Response } from "express";
import Controller from "../interfaces/controller";

class HomeController implements Controller {
  public path = '/home';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.home);
  }

  private home(req: Request, res: Response): void {
    try {
      res.status(200).json({
        message: "Hello world"
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

export default HomeController;