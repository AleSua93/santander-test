import dotenv  from "dotenv"
dotenv.config({ path: '.env' });

import App from "./app";
import config from "./configuration/config";
import AuthController from "./controllers/auth-controller";
import BeersController from "./controllers/beers-controller";
import MeetupsController from "./controllers/meetups-controller";
import WeatherController from "./controllers/weather-controller";
import { sequelize } from "./db/models/index";

const app: App = new App(
  [
    new WeatherController(),
    new BeersController(),
    new MeetupsController(),
    new AuthController
  ],
  config.port
)

app.listen();

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });