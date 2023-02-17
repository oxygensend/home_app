import { Server } from '../../src/lib/server';
import { User, UserInterface } from '../../src/models/user.model';
import * as bcrypt from 'bcrypt';
import { HTTP_CODES } from '../../src/config/http.codes';
import supertest from 'supertest';
import { Container } from 'typedi';
import { TokenStorage } from '../../src/crypto/storage/token.storage';
import {
    AuthPayloadInterface,
    RefreshPayloadInterface,
    TokenType,
} from '../../src/crypto/crypto.types';
import { DateTime } from 'luxon';
import {Authenticator} from "../../src/crypto/auth/authenticator";
import * as mongoose from "mongoose";

interface LoginParameters {
    _username?: string;
    _password?: string;
}

describe('user module', () => {
    let request: supertest.SuperTest<supertest.Test>;
    let server: Server;
    const tokenStorage = Container.get(TokenStorage);

    let email = 'test@test.com';
    let username = 'test123';
    let password = 'test123';
    let user: UserInterface;

    beforeAll(async () => {
        server = Server.getInstance();
        server.run();
        request = supertest(server.getApp());

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        user = await User.create({
            email: email,
            username: username,
            name: 'test',
            surname: 'test',
            password: hash,
        });
    });

    afterAll(async () => {
        await User.deleteMany({});
    });

    describe('POST /auth', () => {
        const exec = ({
            _username = username,
            _password = password,
        }: LoginParameters) => {
            return request
                .post('/auth')
                .send({ username: _username, password: _password });
        };

        it('should return 400 if user doesnt exist', async () => {
            const res = await exec({ _username: 'test', _password: 'test123' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if password is invalid', async () => {
            const res = await exec({ _password: 'invalid password' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if username is invalid', async () => {
            const res = await exec({ _username: 'invalid' });

            expect(res.status).toBe(400);
        });

        it('return should contain auth token and refresh token', async () => {
            const res = await exec({});

            expect(Object.keys(res.body)).toEqual([
                'accessToken',
                'refreshToken',
            ]);
        });

        it('should return return proper accessToken', async () => {
            const res = await exec({});

            const token = tokenStorage.validateToken<AuthPayloadInterface>(
                res.body.accessToken,
                TokenType.auth
            );

            expect(token.username).toBe(user.username);
        });

        it('should return return proper refreshToken', async () => {
            const res = await exec({});

            const token = tokenStorage.validateToken<RefreshPayloadInterface>(
                res.body.refreshToken,
                TokenType.refresh
            );

            expect(token.sessionId).toEqual(user._id.toString());
        });
    });

    describe('POST /refresh_token', () => {
        it('should return 401 if passed token is invalid', async () => {
            const token = tokenStorage.generateToken<RefreshPayloadInterface>({
                sessionId: new mongoose.Types.ObjectId().toString(),
                type: TokenType.refresh,
            });
            const res = await request
                .post('/refresh_token')
                .send({ token: token });

            expect(res.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
        });

        it('should return 401 if passed token is expired', async () => {
            const token = tokenStorage.generateToken<RefreshPayloadInterface>({
                sessionId: user._id,
                type: TokenType.refresh,
                exp: DateTime.now().minus({ second: 3600 }),
            });
            const res = await request
                .post('/refresh_token')
                .send({ token: token });

            expect(res.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
        });

        it('should return new access and refresh token', async () => {
            //timezone issue
            const tokens = await Container.get(Authenticator).authentication(user._id);
            const res = await request
                .post('/refresh_token')
                .send({ token: tokens.refreshToken});

            console.log(res.body);
            expect(res.statusCode).toBe(HTTP_CODES.SUCCESS);
        });
    });
});
