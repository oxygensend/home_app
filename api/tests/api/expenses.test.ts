import supertest from "supertest";
import {Server} from "../../src/lib/server";


describe('expense module', () => {
    let request: supertest.SuperTest<supertest.Test>;
    let server: Server;


    beforeAll(async () => {
        server = Server.getInstance();
        server.run();
        request = supertest(server.getApp());

    });

    describe('POST /expenses', () => {


    })

})