import express, { Request, Response } from "express";
import expressJwt from "express-jwt";
import config from "../configuration/config";
import Controller from "../interfaces/controller";
import { WeatherForecast } from "../interfaces/forecasts";
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
    this.router.get(
      `${this.path}/forecasts`,
      expressJwt({ secret: config.jwtSigningKey, algorithms: ['HS256'] }),
      this.getForecasts.bind(this));
  }

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