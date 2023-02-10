import {config as configDotEnv} from "dotenv" ;

configDotEnv({path: '.env.local'})

export namespace config {

    export const rootDirectory = process.env.PWD;
    export const testDirectory = process.env.PWD + '/tests';
    export const db_url = process.env["MONGODB_URI"];
    export const port = process.env.PORT;
}