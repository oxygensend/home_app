import {Service} from "typedi";
import winston from "winston";
import {TokenStorage} from "../crypto/storage/token.storage";
import {Logger} from "../lib/logger";
import {AuthPayloadInterface, AuthResponseInterface, RefreshPayloadInterface, TokenType} from "../crypto/crypto.types";
import {User} from "../models/user.model";
import {App} from "../exceptions/exceptions";
import {Session} from "../models/session.model";
import {SessionService} from "./session.service";

@Service()
export class AuthenticationService {
    private readonly logger: winston.Logger;

    constructor(private readonly tokenStorage: TokenStorage, private readonly sessionService: SessionService) {
        this.logger = Logger.getLogger();
    }


    async authentication(userId: string): Promise<AuthResponseInterface> {

        const user = await User.findById(userId);

        if (!user) {
            throw new App.InvalidTokenException();
        }

        const refreshToken = this.tokenStorage.generateToken<RefreshPayloadInterface>({
            sessionId: user._id,
            type: TokenType.refresh
        });

        await this.sessionService.startSession(user._id);

        //emit event for logging
        return {
            accessToken: this.tokenStorage.generateToken<AuthPayloadInterface>({
                name: user.name,
                surname: user.surname,
                username: user.username,
                email: user.email,
                type: TokenType.auth
            }),
            refreshToken: refreshToken
        };
    }


}