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
    this.router.get(
      `${this.path}/forecast`,
      expressJwt({ secret: config.jwtSigningKey, algorithms: ['HS256'] }),
      this.getForecast.bind(this));
  }

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