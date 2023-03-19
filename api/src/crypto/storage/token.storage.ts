import { CryptoKeys } from '../keys/crypto.keys';
import { Service } from 'typedi';
import { TokenPayloadInterface, TokenType } from '../crypto.types';
import * as jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { App } from '../../exceptions';
import { config } from '../../config/config';

/**
 * Class responsible for handling authentication tokens
 */
@Service()
export class TokenStorage {
    constructor(private readonly cryptoKeys: CryptoKeys) {}

    public generateToken<T extends TokenPayloadInterface>(payload: T): string {
        const now = DateTime.now();
        return jwt.sign(
            {
                ...payload,
                iat: now.toUnixInteger(),
                exp: now.plus({ seconds: config.defaultTokenTTL }).toUnixInteger(),
            },
            this.cryptoKeys.private,
            { algorithm: 'RS256' },
        );
    }

    public validateToken<T extends TokenPayloadInterface>(token: string, type: TokenType): T {
        const payload = jwt.verify(token, this.cryptoKeys.public) as T;

        if (type !== payload.type) {
            throw new App.InvalidTokenException('Token type mismatch');
        }
        return payload;
    }
}
