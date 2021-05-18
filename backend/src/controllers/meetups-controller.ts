import express, { Request, Response } from "express";
import Controller from "../interfaces/controller";

class MeetupsController implements Controller {
  public path = '/meetups';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.createMeetup.bind(this));
  }

  // Returns forecasts for the next 16 days
  private async createMeetup(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body);

      

      res.status(200).json("hello there");
    } catch (err) {
      res.status(400).json(err);
    }
  }
}

export default MeetupsController;