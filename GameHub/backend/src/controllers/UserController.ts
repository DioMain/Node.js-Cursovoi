import { JwtPayload } from "jsonwebtoken";
import DataBase from "../DataBase";
import JwtManager from "../JwtManager";
import { Controller, Dependency, MVCController, MVCManager, MapGet, MapPost } from "../MVC";
import { Request, Response, response } from "express";
import { UserRole } from "../models/User";
import { DataManager } from "../DataManager";


@Controller
class UserController extends MVCController {
    public db: DataBase;
    public localData: DataManager;
    public jwt: JwtManager;

    constructor() {
        super();

        this.db = this.UseDependency("DataBase");
        this.jwt = this.UseDependency("Jwt");
        this.localData = this.UseDependency("Data");
    }

    @MapGet('/api/auth')
    async Auth(req: Request, res: Response) {
        let token = req.cookies.jwt;

        if (token == undefined){
            res.json({ auth: false });
            return;
        }

        if (this.jwt?.IsValidToken(token)) {
            let tokenData = this.jwt?.AuthenticateToken(token) as JwtPayload;

            let user = await this.db?.GetUser(tokenData.userId);

            res.json({ auth: true, data: { id: user?.id, name: user?.name, email: user?.email, description: user?.description, role: user?.role }});
        }
        else {
            res.json({ auth: false });
        }
    }

    @MapPost('/api/login')
    async Login(req: Request, res: Response) {
        let user = await this.db.GetUser(1);

        let token = this.jwt.GenerateToken(user?.id as number, user?.role as string);

        res.cookie("jwt", token);

        res.json({ success: true });
    }

    @MapGet("/api/getUserIconLink")
    GetUserIcon(req: Request, res: Response) {
        let id = Number.parseInt(req.query.id as string);
        
        let userData = this.localData.GetUserData(id);

        if (userData != undefined) {
            res.json({ iconLink: `/users/${id}/icon.png` });
        }
        else {
            res.writeHead(404, `${id} user data not found!`);
            res.end();
        }
    }
}

export default UserController;