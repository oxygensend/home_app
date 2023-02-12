import winston from "winston";
import {Logger} from "../lib/logger";
import {LoginDto} from "../dto/login.dto";
import {User} from "../models/user.model";
import {HttpExceptions} from "../exceptions/exceptions";
import * as bcrypt from "bcrypt";
import {TokenStorage} from "../crypto/storage/token.storage";
import {AuthResponseInterface, RefreshPayloadInterface, TokenType} from "../crypto/crypto.types";
import {Service} from "typedi";
import {AuthenticationService} from "./authentication.service";
import {RefreshTokenDto} from "../dto/refresh.token.dto";
import {DateTime} from "luxon";
import {SessionService} from "./session.service";

@Service()
export class UserService {

    private readonly logger: winston.Logger;

    constructor(private readonly authenticationService: AuthenticationService,
                private readonly tokenStorage: TokenStorage,
                private readonly sessionService: SessionService) {
        this.logger = Logger.getLogger();
    }


    public async login(loginDto: LoginDto): Promise<AuthResponseInterface> {

        const user = await User.findOne({username: loginDto.username})
        if (!user)
            throw new HttpExceptions.BadRequest("Invalid credentials.");

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new HttpExceptions.BadRequest("Invalid credentials");
        }

        return this.authenticationService.authentication(user._id);
    }

    public async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseInterface> {

        const {sessionId} = await this.tokenStorage
            .validateToken<RefreshPayloadInterface>(refreshTokenDto.token, TokenType.refresh);

        const session = await this.sessionService.getSession(sessionId);

        if (!session ) {
            throw new HttpExceptions.Unauthorized("Expired session");
        }

        return this.authenticationService.authentication(sessionId);
    }
}