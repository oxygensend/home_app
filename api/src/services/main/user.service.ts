import winston from 'winston';
import { Logger } from '../../lib/logger';
import { User } from '../../models/user.model';
import { HttpExceptions } from '../../exceptions';
import * as bcrypt from 'bcrypt';
import { TokenStorage } from '../../crypto/storage/token.storage';
import { AuthResponseInterface, RefreshPayloadInterface, TokenType } from '../../crypto/crypto.types';
import { Service } from 'typedi';
import { Authenticator } from '../../crypto/auth/authenticator';
import { SessionManager } from '../../crypto/auth/session.manager';
import { DateTime } from 'luxon';
import { LoginDto, RefreshTokenDto } from '../../dto';

/**
 * Class responsible for user data manipulation
 */
@Service()
export class UserService {
    private readonly logger: winston.Logger;

    constructor(
        private readonly authenticator: Authenticator,
        private readonly tokenStorage: TokenStorage,
        private readonly sessionManager: SessionManager,
    ) {
        this.logger = Logger.getLogger();
    }

    public async login(loginDto: LoginDto): Promise<AuthResponseInterface> {
        const user = await User.findOne({ username: loginDto.username });
        if (!user) throw new HttpExceptions.BadRequest('Invalid credentials.');

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new HttpExceptions.BadRequest('Invalid credentials');
        }

        return this.authenticator.authentication(user._id);
    }

    public async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseInterface> {
        const { sessionId } = await this.tokenStorage.validateToken<RefreshPayloadInterface>(
            refreshTokenDto.token,
            TokenType.refresh,
        );

        const session = await this.sessionManager.getSession(sessionId);

        if (!session) {
            throw new HttpExceptions.Unauthorized('Session expired');
        }

        return this.authenticator.authentication(sessionId);
    }
}
