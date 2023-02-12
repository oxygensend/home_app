import {HTTP_CODES} from "../config/http.codes";
import {ValidationError} from "class-validator";

export abstract class HttpException extends Error {
    public constructor(message?: String | object) {
        super(typeof (message) === 'string' ? message : JSON.stringify(message));
    }

    public abstract statusCode(): HTTP_CODES
}

export namespace App {
    import Unauthorized = HttpExceptions.Unauthorized;

    export class NoCryptoKeyException extends Error {}
    export class InvalidTokenException extends Error {}
}

export namespace HttpExceptions {
    export class NotFound extends HttpException {
        public statusCode(): HTTP_CODES {
            return HTTP_CODES.NOT_FOUND;
        }
    }

    export class Internal extends HttpException {
        public statusCode(): HTTP_CODES {
            return HTTP_CODES.INTERNAL_SERVER_ERROR;
        }
    }

    export class AccessDenied extends HttpException {
        public statusCode(): HTTP_CODES {
            return HTTP_CODES.FORBIDDEN;
        }
    }

    export class Unauthorized extends HttpException {
        public statusCode(): HTTP_CODES {
            return HTTP_CODES.UNAUTHORIZED;
        }
    }

    export class BadRequest extends HttpException {

        public statusCode(): HTTP_CODES {
            return HTTP_CODES.BAD_REQUEST;
        }
    }
}