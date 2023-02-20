import supertest from 'supertest';
import { Server } from '../../src/lib/server';
import fs from 'fs';
import { config } from '../../src/config/config';
import { User } from '../../src/models/user.model';
import { Shop } from '../../src/models/shop.model';
import { HTTP_CODES } from '../../src/config/http.codes';

describe('shops module', () => {
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
        let users: [] = JSON.parse(rawJson.toString());
        await User.collection.insertMany(users);
        rawJson = fs.readFileSync(config.testDirectory + '/dummy/shops.json');
        let shops: [] = JSON.parse(rawJson.toString());
        console.log(shops)
        await Shop.collection.insertMany(shops);

    });

    afterAll(async () => {
        await User.deleteMany({});
        await Shop.deleteMany({});
    });

    describe('GET /shops', () => {
        it('should return 401 if user is unauthorized', async () => {
            const res = await request.get('/shops');

            expect(res.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
        });

        it('should return list of all shops in  alphabetical order', async () => {
            const token = await loginRequest();
            const res = await request
                .get('/shops')
                .set({ Authorization: token });

            const shops = res.body;
            expect(res.statusCode).toBe(HTTP_CODES.SUCCESS);
            expect(shops[0] <= shops.pop()).toBeTruthy();
        });

        it('should have possibility to search through that list', async () => {
            const token = await loginRequest();
            const res = await request
                .get('/shops?search=biedronka')
                .set({ Authorization: token });

            expect(res.statusCode).toBe(HTTP_CODES.SUCCESS);
            expect(res.body.length).toBe(1);
        });
    });
});
