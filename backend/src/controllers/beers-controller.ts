import express, { Request, Response } from "express";
import Controller from "../interfaces/controller";
import { WeatherForecast, BeersForecast } from "../interfaces/forecasts";
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
    this.router.get(`${this.path}/forecast`, this.getForecasts.bind(this));
  }

  // Returns forecasts for the next 16 days
  private async getForecasts(req: Request, res: Response): Promise<void> {
    try {
      const date = req.query.date as string;
      const numPeople = parseInt(req.query.people as string);

      if (!date || !numPeople) {
        throw Error("Wrong query parameters");
      }

      const weatherForecast: WeatherForecast = await this.weatherService.getForecast(date);
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