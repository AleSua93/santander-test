import dotenv  from "dotenv"
dotenv.config({ path: '.env' });

import App from "./app";
import config from "./configuration/config";
import BeersController from "./controllers/beers-controller";
import MeetupsController from "./controllers/meetups-controller";
import WeatherController from "./controllers/weather-controller";

const app: App = new App(
    [
      new WeatherController(),
      new BeersController(),
      new MeetupsController()
    ],
    config.port
  )

app.listen();


