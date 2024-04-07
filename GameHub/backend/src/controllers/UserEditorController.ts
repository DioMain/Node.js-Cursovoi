import { Request, Response } from "express";
import { Controller, MVCController, MapPost } from "../MVC";
import Server from "../Server";
import JwtManager from "../JwtManager";
import DataBase from "../DataBase";
import { JwtPayload } from "jsonwebtoken";
import fs from "fs";

@Controller
class UserEditorController extends MVCController {
    private server: Server;
    private jwt: JwtManager;
    private db: DataBase;

    constructor() {
        super();

        this.server = this.UseDependency("Server");
        this.jwt = this.UseDependency("Jwt");
        this.db = this.UseDependency("DataBase");

        this.server.App.post("/api/edituser", this.server.Multer.single('userIcon'), this.EditUser.bind(this));
    }

    async EditUser(req: Request, res: Response) {
        if (this.jwt.IsValidToken(req.cookies.jwt)){

            let jwtData = this.jwt.AuthenticateToken(req.cookies.jwt) as JwtPayload;

            let user = await this.db.Instance.user.findFirst({ where: { id: jwtData.userId }});

            if (req.file) {
                fs.copyFileSync(`${req.file.destination}/${req.file.filename}`, `./static/users/${user?.id}/icon.png`);
                fs.unlinkSync(`${req.file.destination}/${req.file.filename}`);
            }

            if (req.body.userNickname === "") 
                req.body.userNickname = user?.name;

            await this.db.Instance.user.update({ where: { id: user?.id }, data: { name: req.body.userNickname, description: req.body.userDescription }});

            res.json({ ok: true });
        }
        else {
            res.json({ ok: false, error: "jwt" });
        }
    }   
}

export default UserEditorController;