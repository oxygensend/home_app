import {Service} from "typedi";
import {Session, SessionInterface} from "../models/session.model";

@Service()
export class SessionService {

    public async startSession(sessionId: string): Promise<SessionInterface> {
        await Session.deleteOne({sessionId});
        return Session.create({_id: sessionId});
    }

    public async getSession(sessionId: string): Promise<SessionInterface | null> {
        return Session.findById(sessionId);
    }
}
