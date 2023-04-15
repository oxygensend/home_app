import { model, Schema } from 'mongoose';
import { DateTime } from 'luxon';
import { config } from '../config/config';

export interface SessionInterface {
    _id?: string;
}

const sessionSchema = new Schema<SessionInterface>({
});

export const Session = model<SessionInterface>('Session', sessionSchema);
