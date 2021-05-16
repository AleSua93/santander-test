import dotenv  from "dotenv"
dotenv.config({ path: '.env' });

import App from "./app";
import config from "./configuration/config";
import WeatherController from "./controllers/weather-controller";

const app: App = new App(
    [
      new WeatherController()
    ],
    config.port
  )

app.listen();


