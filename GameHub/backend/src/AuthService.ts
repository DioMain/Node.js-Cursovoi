import { Request } from "express";
import DataBase from "./DataBase";
import JwtManager from "./JwtManager";
import { user } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

class AuthService {
    private jwt: JwtManager;
    private db: DataBase;

    constructor(jwt: JwtManager, db: DataBase) {
        this.jwt = jwt, this.db = db;
    }

    async Auth(req: Request): Promise<user> {
        if (this.jwt.IsValidToken(req.cookies.jwt)) {
            let jwtdata = this.jwt.AuthenticateToken(req.cookies.jwt) as JwtPayload;

            let user = await this.db.GetUser(jwtdata.userId);

            if (user) 
                return user;
            else 
                throw "User is not exist";
        }
        else throw "jwt";
    }
}

export default AuthService;