import { Service } from 'typedi';
import { Session, SessionInterface } from '../../models/session.model';

/**
 * Class responsible for handling authentication session
 */
@Service()
export class SessionManager {
    public async startSession(sessionId: string): Promise<SessionInterface> {
        await Session.deleteOne({ sessionId });
        return Session.create({ _id: sessionId });
    }

    public async getSession(sessionId: string): Promise<SessionInterface | null> {
        return Session.findById(sessionId);
    }
}
