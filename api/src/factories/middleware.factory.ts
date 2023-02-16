import {Container} from "typedi";
import {MiddlewareInterface} from "../middlewares/middleware.interface";

/**
 * Abstract Factory creating and binding middlewares
 */
export abstract class MiddlewareFactory {
    static bind<T extends MiddlewareInterface>(Class: new () => T): any {
        const middleware = Container.get(Class);
        return middleware.call.bind(middleware);
    }

}