import {config as configDotEnv} from "dotenv" ;

configDotEnv({path: '.env.local'})

export namespace config {

    export const rootDirectory = process.env.PWD;
    export const controllersDirectory = process.env.PWD + '/src/controllers';
    export const testDirectory = process.env.PWD + '/tests';
    export const db_url = process.env["MONGODB_URI"];
    export const port = process.env.PORT;
    export const cryptoPrivateKey = process.env.PWD + '/src/config/crypto/crypto.key';
    export const cryptoPublicKey = process.env.PWD + '/src/config/crypto/crypto.key.pub';
    export const sessionTTL = 3600;
    export const defaultTokenTTL = 1800;
}