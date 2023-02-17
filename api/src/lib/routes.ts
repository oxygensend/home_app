import { Router } from 'express';
import { Method, IRoute } from '../decorators/route.types';
import { Container } from 'typedi';
import 'reflect-metadata';
import { MiddlewareFactory } from '../factories/middleware.factory';
import * as fs from 'fs';
import { config } from '../config/config';
import * as path from 'path';
import controllersDirectory = config.controllersDirectory;

export class Routes {
    private readonly router: Router;
    private static instance: Routes;

    private constructor() {
        this.router = Router();
    }

    public static getInstance(): Routes {
        if (!Routes.instance) {
            Routes.instance = new Routes();
        }
        return Routes.instance;
    }

    public setRoute(
        method: Method,
        path: string,
        middlewares: any[],
        binding: any
    ) {
        this.router[method](
            path,
            ...middlewares.map((middleware) =>
                MiddlewareFactory.bind(middleware)
            ),
            binding
        );
    }

    public getRouter(): Router {
        return this.router;
    }

    public registerRoutes(): void {
        fs.readdirSync(config.controllersDirectory)
            .filter((file) => file.endsWith('.controller.ts'))
            .forEach((file) => {
                const controllerModule = require(path.join(
                    controllersDirectory,
                    file
                ));
                const instance: any = Container.get(controllerModule.default);
                const routes: IRoute[] = Reflect.getMetadata(
                    'routes',
                    controllerModule.default
                );
                const prefix: string = Reflect.getMetadata(
                    'prefix',
                    controllerModule.default
                );
                routes.forEach((route: IRoute) => {
                    this.setRoute(
                        route.method,
                        `${prefix}${route.path}`,
                        route.middlewares,
                        instance[route.methodName].bind(instance)
                    );
                });
            });
    }
}
