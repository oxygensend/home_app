import supertest from "supertest";
import {Server} from "../../src/lib/server";
import {UserInterface, User} from "../../src/models/user.model";
import * as bcrypt from "bcrypt";
import {HTTP_CODES} from "../../src/config/http.codes";
import {describe} from "node:test";


interface LoginParameters {
    _username?: string,
    _password?: string
}

describe('user module', () => {

    let request: supertest.SuperTest<supertest.Test>;
    let server: Server;

    beforeAll(async () => {
        server = Server.getInstance();
        server.run();
        request = supertest(server.getApp());
    })

    describe('POST /auth', () => {

        let email = 'test@test.com';
        let username = 'test123';
        let password = 'test123';
        let user: UserInterface;
        const exec = ({_username = username, _password = password}: LoginParameters) => {
            return request
                .post('/api/auth')
                .send({username: _username, password: _password});
        };

        beforeAll(async () => {

            const salt = await bcrypt.genSalt(666);
            const hash = await bcrypt.hash(password, salt);
            user = await User.create({
                email: email,
                username: username,
                name: 'test',
                surname: 'test',
                password: hash
            })
        })

        afterAll(async () => {
            await User.deleteMany({});
        })
        it('should return 400 if user doesnt exist', async () => {
            const res = await exec({_username: 'test123', _password: 'test123'});

            expect(res.status).toBe(400);
        });

        it('should return 400 if password is invalid', async () => {
            const res = await exec({_password: 'invalid password'});

            expect(res.status).toBe(400);
        });

        it('should return 400 if username is invalid', async () => {
            const res = await exec({_username: "invalid"});

            expect(res.status).toBe(400);
        });

        it('return should contain auth token and refresh token', async () => {
            const res = await exec({});

            expect(res).toHaveProperty('accessToken');
            expect(res).toHaveProperty('refreshToken');
        });

    });

    describe("POST /refresh_token", () => {
        let email = 'test@test.com';
        let username = 'test123';
        let password = 'test123';
        let user: UserInterface;

        beforeAll(async () => {

            const salt = await bcrypt.genSalt(666);
            const hash = await bcrypt.hash(password, salt);
            user = await User.create({
                email: email,
                username: username,
                name: 'test',
                surname: 'test',
                password: hash
            })
        })

        it('should return 401 if passed token is invalid', async () => {

            const res = await request.post('/api/refresh_token').send({token: '12311234123124123'});

            expect(res.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
        });

        it('should return 401 if passed token is expired', async () => {

            // mock token create service
            const res = await request.post('/api/refresh_token').send({token: '12311234123124123'});

            expect(res.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
        });

        it('should return new access and refresh token', async () => {

            // mock token create service
            const res = await request.post('/api/refresh_token').send({token: '12311234123124123'});

            expect(res.statusCode).toBe(HTTP_CODES.SUCCESS);
        });
    });
});