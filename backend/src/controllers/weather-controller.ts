import express, { Request, Response } from "express";
import expressJwt from "express-jwt";
import config from "../configuration/config";
import { JWTPayload } from "../interfaces/auth";
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
    this.router.get(`${this.path}/forecasts`, this.getForecasts.bind(this));
    this.router.post(`${this.path}/cache`, this.refreshCache.bind(this));
  }

  /**
  * @swagger
  * /weather/forecasts:
  *   get:
  *     summary: Retrieves a list of weather forecasts
  *     tags:
  *       - Weather
  *     responses:
  *       '200':
  *         description: "Forecasts returned"
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/WeatherForecast'
  *       '400':
  *         description: "Bad request"
  *       '401':
  *         description: "Unauthorized"
  */
  private async getForecasts(req: Request, res: Response): Promise<void> {
    try {
      const tokenPayload: JWTPayload = req.user as JWTPayload;
      if (!tokenPayload.isAdmin) {
        res.sendStatus(401);
        return;
      }

      const weatherForecasts: WeatherForecast[] = await this.weatherService.getForecasts();

      res.status(200).json(weatherForecasts);
    } catch (err) {
      res.status(400).json(err);
    }
  }

  /**
  * @swagger
  * /weather/cache:
  *   post:
  *     summary: Refreshes weather forecasts cache
  *     tags:
  *       - Weather
  *     responses:
  *       '201':
  *         description: "Cache refreshed"
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/WeatherForecast'
  *       '400':
  *         description: "Bad request"
  *       '401':
  *         description: "Unauthorized"
  */
  private async refreshCache(req: Request, res: Response): Promise<void> {
    try {
      const tokenPayload: JWTPayload = req.user as JWTPayload;
      if (!tokenPayload.isAdmin) {
        res.sendStatus(401);
        return;
      }
      
      const result: WeatherForecast[] = await this.weatherService.refreshCache();

      res.status(201).json(result);
    } catch (err) {
      res.status(400).json(err);
    }
  }
}

export default WeatherController;