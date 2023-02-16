import express, {Application} from "express";
import {Database} from "./database";
import {Routes} from "./routes";
import {Logger} from "./logger";
import winston from "winston";
import "express-async-errors";
import * as os from "os";
import {parse} from "express-form-data";
import cors from "cors";
import {Container} from "typedi";
import {ErrorMiddleware} from "../middlewares/error.middleware";

export class Server {

    private readonly app: Application;
    private readonly port: string | number;
    private static instance: Server;
    private routes: Routes;
    private logger: winston.Logger;
    private httpServer: any;

    private constructor() {
        this.app = express();
        this.port = <string>process.env["PORT"] || 3000;
        this.routes = Routes.getInstance();
        this.logger = Logger.getLogger();
    }

    public static getInstance(): Server {
        if (!Server.instance) {
            Server.instance = new Server();
        }
        return Server.instance;
    }

    public run(): void {

        this.config();
        if (process.env.NODE_ENV !== 'test') {
            this.httpServer = this.app.listen(this.port, () => {
                this.logger.info(`App is listening on port ${this.port} !`)
            })
        }
    }

    public close(): void {
        this.httpServer.close();
    }

    private config(): void {
        this.app.use(express.json());
        this.app.use(parse({
            uploadDir: os.tmpdir(),
            autoClean: true,
        }));
        this.routesSetUp();

        const errorHandler = Container.get(ErrorMiddleware);
        this.app.use(errorHandler.call.bind(errorHandler));

        this.databaseSetUp();
        this.app.use(cors());

    }

    private databaseSetUp(): void {
        const database = new Database();
        database.connect().then(data => console.log(data));
    }

    private routesSetUp(): void {
        this.app.use(this.routes.getRouter());
        this.routes.registerRoutes();

    }

    public getApp(): Application {
        return this.app;
    }
}
