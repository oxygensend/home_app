import supertest from 'supertest';
import { Server } from '../../src/lib/server';
import { DateTime } from 'luxon';
import { HTTP_CODES } from '../../src/config/http.codes';
import fs from 'fs';
import { config } from '../../src/config/config';
import { User } from '../../src/models/user.model';
import { Expense, ExpenseInterface } from '../../src/models/expense.model';
import { isoDateReviver } from '../utils';

describe('expense module', () => {
    let request: supertest.SuperTest<supertest.Test>;
    let server: Server;

    const loginRequest = async (username: string = 'test', password: string = 'test123') => {
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
        let rawJson: Buffer = fs.readFileSync(config.testDirectory + '/dummy/users.json');
        let users: [] = JSON.parse(rawJson.toString());
        await User.collection.insertMany(users);
        rawJson = fs.readFileSync(config.testDirectory + '/dummy/expenses.json');
        let expenses: [] = JSON.parse(rawJson.toString(), isoDateReviver);
        await Expense.collection.insertMany(expenses);
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Expense.deleteMany({});
    });

    describe('GET /expenses/excerpts/:month', () => {
        it('should return 401 if user is not authenticated', async () => {
            const res = await request.get('/expenses/excerpts/2022-08');

            expect(res.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
        });

        it('should return 404 if provided month have valid format', async () => {
            const token = await loginRequest();
            const res = await request.get('/expenses/excerpts/2022.08').set({ Authorization: token });

            expect(res.statusCode).toBe(HTTP_CODES.NOT_FOUND);
        });

        it('should return serialized response', async () => {
            const token = await loginRequest();
            const res = await request.get('/expenses/excerpts/2023-02').set({ Authorization: token });

            expect(res.statusCode).toBe(HTTP_CODES.SUCCESS);
            expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['expenses', 'balance', 'total']));
        });

        it('should return expenses monthly list', async () => {
            const token = await loginRequest();
            const res = await request.get('/expenses/excerpts/2023-02').set({ Authorization: token });

            const expenses = await Expense.find({});
            expect(Object.keys(res.body.expenses[0])).toEqual(
                expect.arrayContaining(['_id', 'amount', 'executor', 'executor', 'participants', 'transactionDate']),
            );
        });

        it('should return monthly balance statistics', async () => {
            const token = await loginRequest();
            const res = await request.get('/expenses/excerpts/2023-02').set({ Authorization: token });

            expect(Object.keys(res.body.balance[0])).toEqual(
                expect.arrayContaining(['executor', 'totalAmount', 'expensesCount']),
            );
        });

        //TODO add query filters
    });

    describe('GET expense /:id', () => {
        let expense: ExpenseInterface;
        beforeAll(async () => {
            const temp = await Expense.findOne({}, [], {
                $orderBy: { createdAt: -1 },
            });
            if (!temp) {
                throw Error();
            }
            expense = temp;
        });

        it('should return 401 if user is not authenticated', async () => {
            const res = await request.get('/expenses/' + expense._id);

            expect(res.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
        });

        it('should return 403 if user is not participant', async () => {
            const token = await loginRequest('test2', 'test123');
            const res = await request.get('/expenses/' + expense._id).set({ Authorization: token });

            expect(res.statusCode).toBe(HTTP_CODES.FORBIDDEN);
        });

        it('should return 200 and valid response', async () => {
            const token = await loginRequest();
            const res = await request.get('/expenses/' + expense._id).set({ Authorization: token });

            expect(res.statusCode).toBe(HTTP_CODES.SUCCESS);
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining([
                    '_id',
                    'name',
                    'shop',
                    'amount',
                    'executor',
                    'participants',
                    'transactionDate',
                    'createdAt',
                ]),
            );
        });
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
                transactionDate: params?.transactionDate ?? DateTime.now().toISODate(),
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
                token,
            );

            expect(res.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        });
        it('should return 400 if executor is invalid type', async () => {
            const token = await loginRequest();
            const res = await exec(
                {
                    executor: { user: 'test', password: 'test' },
                },
                token,
            );

            expect(res.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        });
        it('should return 400 if executor doesnt exist', async () => {
            const token = await loginRequest();
            const res = await exec(
                {
                    executor: { username: 'test0', email: 'test@test.com' },
                },
                token,
            );

            expect(res.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        });
        it('should return 400 if participants have invalid type', async () => {
            const token = await loginRequest();
            const res = await exec(
                {
                    amount: [{ user: 'test0', password: 'test' }],
                },
                token,
            );

            expect(res.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        });
        it('should return 400 if transactionDate is invalid type', async () => {
            const token = await loginRequest();
            const res = await exec(
                {
                    amount: '23-08-2000',
                },
                token,
            );

            expect(res.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        });
        it('should return 201 if request is valid', async () => {
            const token = await loginRequest();
            const res = await exec({}, token);

            expect(res.statusCode).toBe(HTTP_CODES.CREATED);
        });
    });

    describe('PATCH /expenses/:id', () => {
        let expense: ExpenseInterface;
        beforeAll(async () => {
            const temp = await Expense.findOne({}, [], {
                $orderBy: { createdAt: -1 },
            });
            if (!temp) {
                throw Error();
            }
            expense = temp;
        });

        const exec = (params: any, token?: string) => {
            const req = request.patch('/expenses/' + expense._id).send(params);
            return token ? req.set({ Authorization: token }) : req;
        };

        it('should return 401 if user is not authenticated', async () => {
            const res = await exec({});

            expect(res.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
        });

        it('should return 401 if user is not owner', async () => {
            const token = await loginRequest('test2', 'test123');
            const res = await exec({}, token);

            expect(res.statusCode).toBe(HTTP_CODES.FORBIDDEN);
        });

        it('should return 200 if request is valid', async () => {
            const token = await loginRequest();
            const res = await exec({}, token);

            expect(res.statusCode).toBe(HTTP_CODES.SUCCESS);
        });
    });

    describe('DELETE /expenses/:id', () => {
        let expense: ExpenseInterface;
        beforeAll(async () => {
            const temp = await Expense.findOne({}, [], {
                $orderBy: { createdAt: -1 },
            });
            if (!temp) {
                throw Error();
            }
            expense = temp;
        });

        it('should return 401 if user is not authenticated', async () => {
            const res = await request.delete('/expenses/' + expense._id);

            expect(res.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
        });

        it('should return 403 if user is not executor', async () => {
            const token = await loginRequest('test2', 'test123');
            const res = await request.delete('/expenses/' + expense._id).set({ Authorization: token });

            expect(res.statusCode).toBe(HTTP_CODES.FORBIDDEN);
        });

        it('should return 204 and delete expense', async () => {
            const token = await loginRequest();
            const res = await request.delete('/expenses/' + expense._id).set({ Authorization: token });

            const findExpense = await Expense.findById(expense._id);

            expect(res.statusCode).toBe(HTTP_CODES.NO_CONTENT);
            expect(findExpense).toBeNull();
        });
    });
});
