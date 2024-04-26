import { Request, Response } from "express";
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

    async Auth(req: Request, res: Response): Promise<user> {
        let ajwt;

        if (!this.jwt.IsValidAccessToken(req.cookies.ajwt))  {
            if (!this.jwt.IsValidRefreshToken(req.cookies.rjwt))
                throw "jwt";

            let rjwtdata = this.jwt.AuthenticateRefreshToken(req.cookies.rjwt) as JwtPayload;
            
            ajwt = this.jwt.GenerateAccessToken(rjwtdata.userId);

            res.cookie("ajwt", ajwt);
        }
        else 
            ajwt = req.cookies.ajwt;

        let jwtdata = this.jwt.AuthenticateAccessToken(ajwt) as JwtPayload;

        let user = await this.db.GetUser(jwtdata.userId);

        if (user)
            return user;
        else
            throw "User is not exist";
    }
}

export default AuthService;