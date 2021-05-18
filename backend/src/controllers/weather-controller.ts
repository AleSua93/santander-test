import express, { Request, Response } from "express";
import Controller from "../interfaces/controller";
import { WeatherForecast, BeersForecast } from "../interfaces/forecasts";
import WeatherService from "../services/weather-service";

class WeatherController implements Controller {
  public path = '/weather';
  public router = express.Router();
  private weatherService: WeatherService;

  constructor() {
    this.initializeRoutes();
    this.weatherService = new WeatherService();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/forecasts`, this.getForecasts.bind(this));
  }

  // Returns forecasts for the next 16 days
  private async getForecasts(req: Request, res: Response): Promise<void> {
    try {
      const weatherForecasts: WeatherForecast[] = await this.weatherService.getForecasts();

      res.status(200).json(weatherForecasts);
    } catch (err) {
      res.status(400).json(err);
    }
  }
}

export default WeatherController;