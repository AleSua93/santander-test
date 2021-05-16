import express, { Request, Response } from "express";
import Controller from "../interfaces/controller";
import Forecast from "../interfaces/forecast";
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
    this.router.get(`${this.path}/forecast`, this.getForecast.bind(this));
  }

  // Returns forecasts for the next 16 days
  private async getForecast(req: Request, res: Response): Promise<void> {
    try {
      const forecasts: Forecast[] = await this.weatherService.getForecasts();
      res.status(200).json(forecasts);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

export default WeatherController;