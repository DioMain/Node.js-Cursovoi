import jwt, { JwtPayload } from 'jsonwebtoken';

class JwtManager {
    public accessSecret: string;
    public refreshSecret: string

    constructor(accessSecret: string, refreshSecret: string) {
        this.accessSecret = accessSecret;
        this.refreshSecret = refreshSecret;
    }

    GenerateAccessToken(userId: number): string {
        return jwt.sign({ userId }, this.accessSecret, { expiresIn: '20min' });
    }

    GenerateRefreshToken(userId: number): string {
        return jwt.sign({ userId }, this.refreshSecret, { expiresIn: '60min' });
    }

    AuthenticateAccessToken(token: string): JwtPayload | undefined {
        try {
            return (jwt.verify(token, this.accessSecret) as jwt.JwtPayload);
        }
        catch {
            return undefined;
        }
    }

    AuthenticateRefreshToken(token: string): JwtPayload | undefined {
        try {
            return (jwt.verify(token, this.refreshSecret) as jwt.JwtPayload);
        }
        catch {
            return undefined;
        }
    }

    IsValidAccessToken(token: string): boolean {
        if (this.AuthenticateAccessToken(token) == undefined)
            return false;
        else 
            return true;
    }

    IsValidRefreshToken(token: string): boolean {
        if (this.AuthenticateRefreshToken(token) == undefined)
            return false;
        else 
            return true;
    }
}

export default JwtManager;