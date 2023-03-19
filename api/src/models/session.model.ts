import { model, Schema } from 'mongoose';
import { DateTime } from 'luxon';
import { config } from '../config/config';

export interface SessionInterface {
    _id?: string;
    expiredAt: Date;
}

const sessionSchema = new Schema<SessionInterface>({
    expiredAt: {
        type: Date,
        default: DateTime.now().plus({ seconds: config.sessionTTL }).toJSDate(),
    },
});

export const Session = model<SessionInterface>('Session', sessionSchema);
