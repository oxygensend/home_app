import { Container } from 'typedi';
import {MiddlewareInterface} from "../../middlewares";

/**
 * Abstract Factory creating and binding middlewares
 */
export abstract class MiddlewareFactory {
    static bind<T extends MiddlewareInterface<Error | void>>(
        Class: new () => T
    ): any {
        const middleware = Container.get(Class);
        return middleware.call.bind(middleware);
    }
}
