import express from "express";
import cors from "cors";
import Controller from "./interfaces/controller";
import { Server } from "http";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import path from "path";
import expressJwt from "express-jwt";
import cookieParser from "cookie-parser";
import config from "./configuration/config";

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    // IMPORTANT: always initialize swagger first
    this.initializeSwagger();

    // We're not configuring cors now, but a real app should have it
    this.app.use(cors());
    this.app.use(cookieParser())
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(expressJwt({
      secret: config.jwtSigningKey,
      algorithms: ['HS256']
    }).unless({path: ['/api/auth/login', 'api/auth/refresh', 'api/docs']}));
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/api', controller.router);
    });
  }

  private initializeSwagger() {
    const swaggerOptions = {
      swaggerDefinition: {
        openapi: '3.0.0',
        info: {
          title: "Meetups Santander Challenge API",
          description: "Docs for the Meetups API",
          version: "1.0.0"
        },
        contact: {
          name: "Alejandro Suárez"
        },
        servers: [
          {
           "description": "Local env",
           "url": "http://localhost:5000/api"
          }
        ],
        security: [
          {
            bearerAuth: []
          }
        ]
      },
      apis: [
        path.resolve(`${__dirname}/controllers/*ts`),
        path.resolve(`${__dirname}/docs/definitions.yaml`)
      ]
    }
    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    this.app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
  }

  public listen(): Server {
    return this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;