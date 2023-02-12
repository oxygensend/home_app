import {DateTime} from "luxon";
import {model, Schema} from "mongoose";
import {config} from "../config/config";

export interface SessionInterface {
    _id?: string,
    expiredAt: Date
}

const refreshTokenSchema = new Schema<SessionInterface>({
    expiredAt: {
        type: Date,
        default: Date.now()
    }
})

export const Session = model<SessionInterface>('RefreshToken', refreshTokenSchema);