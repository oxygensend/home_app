import fs from "fs";
import {config} from "../../config/config";
import {App} from "../../exceptions";
import {Service} from "typedi";

/**
 * Class responsible for reading crypto keys from files
 */
@Service()
export class CryptoKeys {
    private _public: string;
    private _private: string

    constructor() {
        this._private = fs.readFileSync(config.cryptoPrivateKey).toString();
        this._public = fs.readFileSync(config.cryptoPublicKey).toString();

        if (!this._public || !this._private) {
            throw new App.NoCryptoKeyException('Missing keys');
        }
    }


    get public(): string {
        return this._public;
    }

    set public(value: string) {
        this._public = value;
    }

    get private(): string {
        return this._private;
    }

    set private(value: string) {
        this._private = value;
    }
}