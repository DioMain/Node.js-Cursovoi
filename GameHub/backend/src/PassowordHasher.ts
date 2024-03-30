import crypto from "crypto";

/**
 * @tutorial SHA2-256
 */
class PassowordHasher {
    public salt: string

    constructor(salt: string) {
        this.salt = salt;
    }

    HashPassword(password: string): string {
        const hash = crypto.createHash('sha256');

        hash.update(password + this.salt);

        const hashedPassword = hash.digest('hex');

        return hashedPassword;
    }
}

export default PassowordHasher;