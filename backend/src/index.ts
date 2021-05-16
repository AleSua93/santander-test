import dotenv  from "dotenv"
import App from "./app";
import config from "./configuration/config";
import HomeController from "./controllers/home-controller";

dotenv.config({ path: '.env' });

const app: App = new App(
    [
      new HomeController()
    ],
    config.port
  )

app.listen();


