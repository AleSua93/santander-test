import express, { Request, Response } from "express";
import expressJwt from "express-jwt";
import config from "../configuration/config";
import Meetup, { MeetupAttributes } from "../db/models/meetup";
import User from "../db/models/user";
import { JWTPayload } from "../interfaces/auth";
import Controller from "../interfaces/controller";
import BeersService from "../services/beers-service";
import WeatherService from "../services/weather-service";
const { Op } = require("sequelize");

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
    this.router.get(`${this.path}/upcoming`,
      expressJwt({ secret: config.jwtSigningKey, algorithms: ['HS256'] }),
      this.getUpcomingMeetups.bind(this));
    this.router.get(`${this.path}/past`,
      expressJwt({ secret: config.jwtSigningKey, algorithms: ['HS256'] }),
      this.getPastMeetups.bind(this));
    this.router.post(
      `${this.path}`,
      expressJwt({ secret: config.jwtSigningKey, algorithms: ['HS256'] }),
      this.createMeetup.bind(this));
    this.router.post(
        `${this.path}/upcoming/:id/subscribe`,
        expressJwt({ secret: config.jwtSigningKey, algorithms: ['HS256'] }),
        this.subscribeToMeetup.bind(this));
    this.router.delete(
      `${this.path}/upcoming/:id/subscribe`,
      expressJwt({ secret: config.jwtSigningKey, algorithms: ['HS256'] }),
      this.unsubscribeFromMeetup.bind(this));
    this.router.post(
        `${this.path}/past/:id/check-in`,
        expressJwt({ secret: config.jwtSigningKey, algorithms: ['HS256'] }),
        this.checkInToMeetup.bind(this));
    this.router.delete(
      `${this.path}/past/:id/check-in`,
      expressJwt({ secret: config.jwtSigningKey, algorithms: ['HS256'] }),
      this.checkOutFromMeetup.bind(this));
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

      res.status(201).json(meetup);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }

  private async getUpcomingMeetups(req: Request, res: Response): Promise<void> {
    try {
      const tokenPayload: JWTPayload = req.user as JWTPayload;

      const meetups = await Meetup.findAll({
        where: {
          date: {
            [Op.gte]: new Date()
          } 
        },
        include: [
          {
            model: User
          }
        ]
      });
      
      const meetupsWithSubscribed = meetups.map(async (meetup) => {
        const hasUser = await meetup.hasUser(tokenPayload.userId);
        return {
          ...meetup.toJSON(),
          isUserSubscribed: hasUser
        }
      })

      const data = await Promise.all(meetupsWithSubscribed);

      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }

  private async getPastMeetups(req: Request, res: Response): Promise<void> {
    try {
      const tokenPayload: JWTPayload = req.user as JWTPayload;

      const meetups = await Meetup.findAll({
        where: {
          date: {
            [Op.lt]: new Date()
          } 
        },
        include: {
          model: User,
        }
      });
      
      const meetupsWithCheckIn = meetups.map(async (meetup) => {
        const hasUser = await meetup.hasUser(tokenPayload.userId);
        return {
          ...meetup.toJSON(),
          isUserCheckedIn: false // TODO fix this
        }
      })

      const data = await Promise.all(meetupsWithCheckIn);

      res.status(200).json(data);
    } catch (err) {
      res.status(400).json(err);
    }
  }

  private async subscribeToMeetup(req: Request, res: Response): Promise<void> {
    try {
      const tokenPayload: JWTPayload = req.user as JWTPayload;

      const meetup = await Meetup.findByPk(req.params.id);

      if (meetup) {
        const hasUser = await meetup.hasUser(tokenPayload.userId);
        if (!hasUser) {
          console.log(`Subscribing user ${tokenPayload.userId} to meetup`);
          meetup.addUser(tokenPayload.userId);    
        } else {
          console.log("User is already subscribed to meetup");
        }
      }

      res.status(201).json(meetup);
    } catch (err) {
      res.status(400).json(err);
    }
  }

  private async unsubscribeFromMeetup(req: Request, res: Response): Promise<void> {
    try {
      const tokenPayload: JWTPayload = req.user as JWTPayload;

      const meetup = await Meetup.findByPk(req.params.id);

      if (meetup) {
        const hasUser = await meetup.hasUser(tokenPayload.userId);
        if (hasUser) {
          console.log(`Unsubscribing user ${tokenPayload.userId} from meetup`);
          meetup.removeUser(tokenPayload.userId);    
        } else {
          console.log("User is already unsubscribed from meetup");
        }
      }

      res.status(201).json(meetup);
    } catch (err) {
      res.status(400).json(err);
    }
  }

  private async checkInToMeetup(req: Request, res: Response): Promise<void> {
    // TODO
  }

  private async checkOutFromMeetup(req: Request, res: Response): Promise<void> {
    // TODO
  }
}

export default MeetupsController;