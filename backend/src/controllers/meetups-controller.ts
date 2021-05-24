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
    this.router.get(`${this.path}/upcoming`, this.getUpcomingMeetups.bind(this));
    this.router.get(`${this.path}/past`, this.getPastMeetups.bind(this));
    this.router.post(`${this.path}`, this.createMeetup.bind(this));
    this.router.post(`${this.path}/upcoming/:id/subscribe`, this.subscribeToMeetup.bind(this));
    this.router.delete(`${this.path}/upcoming/:id/subscribe`, this.unsubscribeFromMeetup.bind(this));
    this.router.post(`${this.path}/past/:id/check-in`, this.checkInToMeetup.bind(this));
    this.router.delete(`${this.path}/past/:id/check-in`, this.checkOutFromMeetup.bind(this));
  }

    /**
   * @swagger
   * /meetups:
   *   post:
   *     tags:
   *       - Meetups
   *     summary: Creates new meetup
   *     responses:
   *       '201':
   *         description: "Meetup created"
   *         content:
   *           application/json:
   *             schema:  
   *               $ref: '#/components/schemas/Meetup'
   *       '400':
   *         description: "Bad request"
   *       '401':
   *         description: "Unauthorized"
   *  */  
  private async createMeetup(req: Request, res: Response): Promise<void> {
    try {
      const tokenPayload: JWTPayload = req.user as JWTPayload;
      if (!tokenPayload.isAdmin) {
        res.sendStatus(401);
        return;
      }
      
      const meetupAttributes = req.body as MeetupAttributes;
      try {
        const forecast = await this.weatherService.getForecast(meetupAttributes.date);
      
        if (forecast) {
          meetupAttributes.tempInCelsius = forecast.temp;
          meetupAttributes.estimatedBeerPacks = 
            this.beerService.getNumBeerPacks(forecast.temp, meetupAttributes.numPeople);
        }
      } catch(err) {
        console.log("Weather data not found, creating without forecasts...");
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

  /**
  * @swagger
  * /meetups/upcoming:
  *   get:
  *     summary: Returns upcoming meetups
  *     tags:
  *       - Meetups
  *     responses:
  *       '200':
  *         description: "List of upcoming meetups returned"
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/Meetup'
  *       '400':
  *         description: "Bad request"
  *       '401':
  *         description: "Unauthorized"
  */
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
            model: User,
            as: 'subscriptions'
          }
        ]
      });
      
      const meetupsWithSubscribed = meetups.map(async (meetup) => {
        const isSubscribed = await meetup.hasSubscription(tokenPayload.userId);
        return {
          ...meetup.toJSON(),
          isUserSubscribed: isSubscribed
        }
      })

      const data = await Promise.all(meetupsWithSubscribed);

      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }

  /**
  * @swagger
  * /meetups/past:
  *   get:
  *     summary: Returns past meetups
  *     tags:
  *       - Meetups
  *     responses:
  *       '200':
  *         description: "List of upcoming meetups returned"
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/Meetup'
  *       '400':
  *         description: "Bad request"
  *       '401':
  *         description: "Unauthorized"
  */
  private async getPastMeetups(req: Request, res: Response): Promise<void> {
    try {
      const tokenPayload: JWTPayload = req.user as JWTPayload;

      const meetups = await Meetup.findAll({
        where: {
          date: {
            [Op.lt]: new Date()
          } 
        },
        include: [
          {
            model: User,
            as: 'checkins'
          }
        ]
      });
      
      const meetupsWithCheckIn = meetups.map(async (meetup) => {
        const isCheckedIn = await meetup.hasCheckin(tokenPayload.userId);
        return {
          ...meetup.toJSON(),
          isUserCheckedIn: isCheckedIn
        }
      })

      const data = await Promise.all(meetupsWithCheckIn);

      res.status(200).json(data);
    } catch (err) {
      res.status(400).json(err);
    }
  }

  /**
   * @swagger
   * /meetups/upcoming/:id/subscribe:
   *   post:
   *     summary: Subscribes to specified meetup
   *     tags:
   *       - Meetups
   *     responses:
   *       '201':
   *         description: "Subscription registered"
   *         content:
   *           application/json:
   *             schema:  
   *               $ref: '#/components/schemas/Meetup'
   *       '400':
   *         description: "Bad request"
   *       '401':
   *         description: "Unauthorized"
   */
  private async subscribeToMeetup(req: Request, res: Response): Promise<void> {
    try {
      const tokenPayload: JWTPayload = req.user as JWTPayload;

      const meetup = await Meetup.findByPk(req.params.id);

      if (meetup) {
        const isSubscribed = await meetup.hasSubscription(tokenPayload.userId);
        if (!isSubscribed) {
          console.log(`Subscribing user ${tokenPayload.userId} to meetup`);
          meetup.addSubscription(tokenPayload.userId);    
        } else {
          console.log("User is already subscribed to meetup");
        }
      }

      res.status(201).json(meetup);
    } catch (err) {
      res.status(400).json(err);
    }
  }

  /**
   * @swagger
   * /meetups/upcoming/:id/subscribe:
   *  delete:
   *    summary: Unsubscribes from specified meetup
   *    tags:
   *      - Meetups
   *    responses:
   *      '200':
   *        description: "Unsubscribe successful"
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Meetup'
   *      '400':
   *        description: "Bad request"
   *      '401':
   *        description: "Unauthorized"
   */
  private async unsubscribeFromMeetup(req: Request, res: Response): Promise<void> {
    try {
      const tokenPayload: JWTPayload = req.user as JWTPayload;

      const meetup = await Meetup.findByPk(req.params.id);

      if (meetup) {
        const isSubscribed = await meetup.hasSubscription(tokenPayload.userId);
        if (isSubscribed) {
          console.log(`Unsubscribing user ${tokenPayload.userId} from meetup`);
          meetup.removeSubscription(tokenPayload.userId);    
        } else {
          console.log("User is already unsubscribed from meetup");
        }
      }

      res.status(200).json(meetup);
    } catch (err) {
      res.status(400).json(err);
    }
  }

  /**
  * @swagger
  * /meetups/past/:id/check-in:
  *   post:
  *     summary: Checks in to specified meetup
  *     tags:
  *       - Meetups
  *     responses:
  *       '201':
  *         description: "Check in successful"
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Meetup'
  *       '400':
  *         description: "Bad request"
  *       '401':
  *         description: "Unauthorized"
  */
  private async checkInToMeetup(req: Request, res: Response): Promise<void> {
    try {
      const tokenPayload: JWTPayload = req.user as JWTPayload;

      const meetup = await Meetup.findByPk(req.params.id);

      if (meetup) {
        const isCheckedIn = await meetup.hasCheckin(tokenPayload.userId);
        if (!isCheckedIn) {
          console.log(`Checking in user ${tokenPayload.userId} to meetup`);
          meetup.addCheckin(tokenPayload.userId);    
        } else {
          console.log("User is already checked in");
        }
      }

      res.status(201).json(meetup);
    } catch (err) {
      res.status(400).json(err);
    }
  }

  /**
  * @swagger
  * /meetups/past/:id/check-in:
  *  delete:
  *    summary: Checks out from specified meetup
  *    tags:
  *      - Meetups
  *    responses:
  *      '200':
  *        description: "Check out successful"
  *        content:
  *          application/json:
  *            schema:
  *              $ref: '#/components/schemas/Meetup'
  *      '400':
  *        description: "Bad request"
  *      '401':
  *        description: "Unauthorized"
  */
  private async checkOutFromMeetup(req: Request, res: Response): Promise<void> {
    try {
      const tokenPayload: JWTPayload = req.user as JWTPayload;

      const meetup = await Meetup.findByPk(req.params.id);

      if (meetup) {
        const isCheckedIn = await meetup.hasCheckin(tokenPayload.userId);
        if (isCheckedIn) {
          console.log(`Checking out user ${tokenPayload.userId} from meetup`);
          meetup.removeCheckin(tokenPayload.userId);    
        } else {
          console.log("User is already checked out from meetup");
        }
      }

      res.status(200).json(meetup);
    } catch (err) {
      res.status(400).json(err);
    }
  }
}

export default MeetupsController;