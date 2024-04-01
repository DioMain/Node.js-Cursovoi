import jwt from 'jsonwebtoken';
import { UserRole } from './models/User';

class JwtManager {
    public secret: string;

    constructor(secret: string) {
        this.secret = secret;
    }

    GenerateToken(userId: number, userRole: string): string {
        return jwt.sign({ userId, userRole }, this.secret, { expiresIn: '5min' });
    }

    AuthenticateToken(token: string) {
        try {
            return (jwt.verify(token, this.secret) as jwt.JwtPayload);
        }
        catch {
            return undefined;
        }
    }

    IsValidToken(token: string) {
        if (this.AuthenticateToken(token) == undefined)
            return false;
        else 
            return true;
    }
}

export default JwtManager;