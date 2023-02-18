import supertest from 'supertest';
import { Server } from '../../src/lib/server';
import { DateTime } from 'luxon';
import { HTTP_CODES } from '../../src/config/http.codes';
import fs from 'fs';
import { config } from '../../src/config/config';
import { User } from '../../src/models/user.model';

describe('expense module', () => {
    let request: supertest.SuperTest<supertest.Test>;
    let server: Server;

    const loginRequest = async (
        username: string = 'test',
        password: string = 'test123'
    ) => {
        const res = await request.post('/auth').send({
            username,
            password,
        });

        return 'Bearer ' + res.body?.accessToken;
    };

    beforeAll(async () => {
        server = Server.getInstance();
        server.run();
        request = supertest(server.getApp());

        // load dummy data
        let rawJson: Buffer = fs.readFileSync(
            config.testDirectory + '/dummy/users.json'
        );
        let videos: [] = JSON.parse(rawJson.toString());
        await User.collection.insertMany(videos);
    });

    afterAll(async () => {
        await User.deleteMany({});
    });

    describe('POST /expenses', () => {
        const exec = (params: any, token?: string) => {
            const defaultBody = {
                amount: params?.amount ?? 100,
                name: params?.name ?? 'test expense',
                shop: params?.shop ?? 'test shop',
                executor: params?.executor ?? {
                    username: 'test',
                    email: 'test@test.com',
                },
                participants: params?.participants ?? [
                    {
                        username: 'test',
                        email: 'test@test.com',
                    },
                    {
                        username: 'test2',
                        email: 'test2@test.com',
                    },
                ],
                transactionDate:
                    params?.transactionDate ?? DateTime.now().toISODate(),
            };

            const req = request.post('/expenses').send(defaultBody);
            return token ? req.set({ Authorization: token }) : req;
        };

        it('should return 401 if user is not authenticated', async () => {
            const res = await exec({});

            expect(res.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
        });

        it('should return 400 if amount is not number type', async () => {
            const token = await loginRequest();
            const res = await exec(
                {
                    amount: 'test',
                },
                token
            );

            expect(res.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        });
        it('should return 400 if executor is invalid type', async () => {
            const token = await loginRequest();
            const res = await exec(
                {
                    executor: { user: 'test', password: 'test' },
                },
                token
            );

            expect(res.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        });
        it('should return 400 if executor doesnt exist', async () => {
            const token = await loginRequest();
            const res = await exec(
                {
                    executor: { username: 'test0', email: 'test@test.com' },
                },
                token
            );

            expect(res.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        });
        it('should return 400 if participants have invalid type', async () => {
            const token = await loginRequest();
            const res = await exec(
                {
                    amount: [{ user: 'test0', password: 'test' }],
                },
                token
            );

            expect(res.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        });
        it('should return 400 if transactionDate is invalid type', async () => {
            const token = await loginRequest();
            const res = await exec(
                {
                    amount: '23-08-2000',
                },
                token
            );

            expect(res.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        });
        it('should return 200 if request is valid', async () => {
            const token = await loginRequest();
            const res = await exec({}, token);

            expect(res.statusCode).toBe(HTTP_CODES.SUCCESS);
        });
    });
});
