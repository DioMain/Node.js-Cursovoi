import { Request, Response } from "express";
import { Controller, MVCController, MVCRouteMethod, MapGet, MapPost, MapRoute } from "../MVC";
import Server from "../Server";
import JwtManager from "../JwtManager";
import DataBase from "../DataBase";
import { JwtPayload } from "jsonwebtoken";
import fs from "fs";
import { DataManager, UserData } from "../DataManager";

@Controller
class UserEditorController extends MVCController {
    private server: Server;
    private jwt: JwtManager;
    private db: DataBase;
    private dataManager: DataManager;

    constructor() {
        super();

        this.server = this.UseDependency("Server");
        this.jwt = this.UseDependency("Jwt");
        this.db = this.UseDependency("DataBase");
        this.dataManager = this.UseDependency("Data");

        this.server.App.put("/api/edituser", this.server.Multer.single('userIcon'), this.EditUser.bind(this));
    }

    async EditUser(req: Request, res: Response) {
        if (this.jwt.IsValidToken(req.cookies.jwt)){

            let jwtData = this.jwt.AuthenticateToken(req.cookies.jwt) as JwtPayload;

            let user = await this.db.Instance.user.findFirst({ where: { id: jwtData.userId }});

            let nData = new UserData();

            nData.UserID = user?.id;

            if (req.file) {
                nData.IconPath = req.file.path;
                
                fs.copyFileSync(`${req.file.destination}/${req.file.filename}`, `./static/users/${user?.id}/icon.png`);
            }
            else
                nData.IconPath = undefined;

            nData.Games = undefined;

            this.dataManager.SetUserData(nData);

            if (req.body.userNickname === "") 
                req.body.userNickname = user?.name;

            await this.db.Instance.user.update({ where: { id: user?.id }, data: { name: req.body.userNickname, description: req.body.userDescription }});

            res.json({ ok: true });
        }
        else {
            res.json({ ok: false, error: "jwt" });
        }

        if (req.file) 
            fs.unlinkSync(`${req.file?.path}`);
    }

    @MapRoute('/api/deleteuser', MVCRouteMethod.DELETE)
    async DeleteUser(req: Request, res: Response) {
        if (this.jwt.IsValidToken(req.cookies.jwt)){

            let jwtData = this.jwt.AuthenticateToken(req.cookies.jwt) as JwtPayload;

            let user = await this.db.Instance.user.findFirst({ where: { id: jwtData.userId }});

            this.dataManager.DeleteUserData(jwtData.userId);

            /// TODO: Просто удалить пользователя будет мало...

            await this.db.Instance.paymentmethod.deleteMany({ where: { User: user?.id }});

            (await this.db.Instance.game.findMany({ where: { User: user?.id } })).forEach(async (game) => {
                this.dataManager.DeleteGameData(game.id);

                await this.db.Instance.game.delete({ where: { id: game.id } });
            });

            await this.db.Instance.user.delete({ where: { id: user?.id }});

            res.clearCookie("jwt");

            res.json({ ok: true });
        }
        else {
            res.json({ ok: false, error: "jwt" });
        }
    }
}

export default UserEditorController;