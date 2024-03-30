import { Request, Response } from "express";
import JwtManager from "../JwtManager";
import { Controller, Dependency, MVCController, MapGet } from "../MVC";
import { JwtPayload } from "jsonwebtoken";
import Server from "../Server";

@Controller
class AppController extends MVCController {
    
    @Dependency("Jwt")
    jwt?: JwtManager;

    @MapGet('/')
    Index(req: Request, res: Response) {
        this.EndView(res);
    }

    @MapGet('/api/CheckJwtToken')
    CheckJwtToken(req: Request, res: Response) {
        const token = req.cookies.jwt;

        if (!token){
            res.json({ auth: false });
            return;
        }           

        if (this.jwt?.IsValidToken(token)){

            let data = this.jwt?.AuthenticateToken(token) as JwtPayload;

            res.json({ auth: true, iconUrl: `users/${data["userId"]}/icon.png` });

            return;
        }          
        else 
            res.json({ auth: false });
    }
}

export default AppController;