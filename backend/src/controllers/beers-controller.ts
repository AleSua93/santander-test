import express, { Request, Response } from "express";
import expressJwt from "express-jwt";
import config from "../configuration/config";
import Controller from "../interfaces/controller";
import { BeersForecast } from "../interfaces/forecasts";
import BeersService from "../services/beers-service";
import WeatherService from "../services/weather-service";

class BeersController implements Controller {
  public path = '/beers';
  public router = express.Router();
  private weatherService: WeatherService;
  private beersService: BeersService;

  constructor() {
    this.initializeRoutes();
    this.weatherService = new WeatherService();
    this.beersService = new BeersService();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/forecast`, this.getForecast.bind(this));
  }

  /**
   * @swagger
   * /beers/forecast:
   *   get:
   *     summary: Returns a forecast with the number of 6 packs estimated
   *     tags:
   *       - Beers
   *     security: 
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: date
   *         description: Planned date for meetup
   *         schema:
   *           type: string
   *         required: true
   *       - in: query
   *         name: people
   *         description: Number of estimated attendees
   *         schema:
   *           type: integer
   *         required: true
   *     responses:
   *       '200':
   *         description: Forecast for weather and estimated beer packs
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/BeersForecast'
   *       '400':
   *         description: Bad request
   *       '401':
   *         description: "Unauthorized"
   *       '404':
   *         description: No forecast available for this date
   *  */  
  private async getForecast(req: Request, res: Response): Promise<void> {
    try {
      const date = req.query.date as string;
      const numPeople = parseInt(req.query.people as string);

      if (!date || !numPeople) {
        throw Error("Wrong query parameters");
      }

      const weatherForecast = await this.weatherService.getForecast(date);

      if (!weatherForecast) {
        res.status(404).json("Forecast not available");
        return;
      }

      const numBeerPacks = await this.beersService.getNumBeerPacks(weatherForecast.temp, numPeople);

      const beersForecast: BeersForecast = {
        ...weatherForecast,
        beerPacks: numBeerPacks
      }

      res.status(200).json(beersForecast);
    } catch (err) {
      res.status(400).json(err);
    }
  }
}

export default BeersController;