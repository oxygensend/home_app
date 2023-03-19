import { DateTime } from 'luxon';

export interface TokenPayloadInterface {
    type: TokenType;
    exp?: DateTime;
    iat?: DateTime;
}

export interface AuthPayloadInterface extends TokenPayloadInterface {
    email: string;
    username: string;
    name: string;
    surname: string;
}

export interface RefreshPayloadInterface extends TokenPayloadInterface {
    sessionId: string;
}

export enum TokenType {
    auth = 'auth',
    refresh = 'refresh',
}

export interface AuthResponseInterface {
    accessToken: string;
    refreshToken: string;
}
