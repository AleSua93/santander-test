import express, { Request, Response } from "express";
import expressJwt from "express-jwt";
import config from "../configuration/config";
import Meetup, { MeetupAttributes } from "../db/models/meetup";
import { JWTPayload } from "../interfaces/auth";
import Controller from "../interfaces/controller";
import BeersService from "../services/beers-service";
import WeatherService from "../services/weather-service";

class MeetupsController implements Controller {
  public path = '/meetups';
  public router = express.Router();
  private weatherService: WeatherService;
  private beerService: BeersService;

  constructor() {
    this.initializeRoutes();
    this.weatherService = new WeatherService();
    this.beerService = new BeersService();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      expressJwt({ secret: config.jwtSigningKey, algorithms: ['HS256'] }),
      this.createMeetup.bind(this));
    this.router.get(`${this.path}`,
      expressJwt({ secret: config.jwtSigningKey, algorithms: ['HS256'] }),
      this.getUpcomingMeetups.bind(this));
  }

  private async createMeetup(req: Request, res: Response): Promise<void> {
    try {
      const tokenPayload: JWTPayload = req.user as JWTPayload;
      if (!tokenPayload.isAdmin) {
        res.sendStatus(401);
        return;
      }
      
      const meetupAttributes = req.body as MeetupAttributes;
      const forecast = await this.weatherService.getForecast(meetupAttributes.date);
      
      if (forecast) {
        meetupAttributes.tempInCelsius = forecast.temp;
        meetupAttributes.estimatedBeerPacks = 
          this.beerService.getNumBeerPacks(forecast.temp, meetupAttributes.numPeople);
      }

      const meetup = await Meetup.create({
        ...meetupAttributes
      });

      res.status(200).json(meetup);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }

  private async getUpcomingMeetups(req: Request, res: Response): Promise<void> {
    try {
      const meetups = await Meetup.findAll();
      res.status(200).json(meetups);
    } catch (err) {
      res.status(400).json(err);
    }
  }
}

export default MeetupsController;