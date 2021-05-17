import dotenv  from "dotenv"
dotenv.config({ path: '.env' });

import App from "./app";
import config from "./configuration/config";
import BeersController from "./controllers/beers-controller";
import WeatherController from "./controllers/weather-controller";

const app: App = new App(
    [
      new WeatherController,
      new BeersController()
    ],
    config.port
  )

app.listen();


