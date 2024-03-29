import { Service } from 'typedi';
import winston from 'winston';
import { SessionManager } from './session.manager';
import { TokenStorage } from '../storage/token.storage';
import { Logger } from '../../lib/logger';
import { AuthPayloadInterface, AuthResponseInterface, RefreshPayloadInterface, TokenType } from '../crypto.types';
import { App, HttpExceptions } from '../../exceptions';
import { User } from '../../models/user.model';
import { DateTime } from 'luxon';
import {config} from "../../config/config";

/**
 * CLass responsible for user authentication
 */
@Service()
export class Authenticator {
    private readonly logger: winston.Logger;

    constructor(private readonly tokenStorage: TokenStorage, private readonly sessionService: SessionManager) {
        this.logger = Logger.getLogger();
    }

    public async authentication(userId: string): Promise<AuthResponseInterface> {
        const user = await User.findById(userId);

        if (!user) {
            throw new App.InvalidTokenException();
        }

        const now = DateTime.now();
        const refreshToken = this.tokenStorage.generateToken<RefreshPayloadInterface>({
            sessionId: user._id,
            type: TokenType.refresh,
            exp: now.plus({ seconds: config.sessionTTL }).toUnixInteger()
        });

        await this.sessionService.startSession(user._id);


        this.logger.info(`Access token generated for user ${user.username} at time: ${DateTime.now()}`);
        // this.emitter.emit()
        //emit event for logging
        return {
            accessToken: this.tokenStorage.generateToken<AuthPayloadInterface>({
                name: user.name,
                surname: user.surname,
                username: user.username,
                email: user.email,
                type: TokenType.auth,
            }),
            refreshToken: refreshToken,
        };
    }

    public getLoggedUser(token: string): AuthPayloadInterface {
        try {
            return this.tokenStorage.validateToken<AuthPayloadInterface>(token, TokenType.auth);
        } catch (err: any) {
            throw new HttpExceptions.Unauthorized(err.message);
        }
    }
}
