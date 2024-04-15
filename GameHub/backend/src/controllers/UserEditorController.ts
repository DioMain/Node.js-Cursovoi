import { Request, Response } from "express";
import { Controller, MVCController, MVCRouteMethod, MapGet, MapPost, MapRoute } from "../MVC";
import Server from "../Server";
import JwtManager from "../JwtManager";
import DataBase from "../DataBase";
import { JwtPayload } from "jsonwebtoken";
import fs from "fs";
import { DataManager, UserData } from "../DataManager";
import AuthService from "../AuthService";

@Controller
class UserEditorController extends MVCController {
    private server: Server;
    private db: DataBase;
    private dataManager: DataManager;
    private auth: AuthService;

    constructor() {
        super();

        this.server = this.UseDependency("Server");
        this.db = this.UseDependency("DataBase");
        this.dataManager = this.UseDependency("Data");
        this.auth = this.UseDependency("Auth");

        this.server.App.put("/api/edituser", this.server.Multer.single('userIcon'), this.EditUser.bind(this));
    }

    async EditUser(req: Request, res: Response) {
        try {
            let user = await this.auth.Auth(req, res);

            let nData = new UserData();

            nData.UserID = user.id;

            if (req.file) {
                nData.IconPath = req.file.path;

                fs.copyFileSync(`${req.file.destination}/${req.file.filename}`, `./static/users/${user.id}/icon.png`);
            }
            else
                nData.IconPath = undefined;

            nData.Games = undefined;

            this.dataManager.SetUserData(nData);

            if (req.body.userNickname === "")
                req.body.userNickname = user?.name;

            await this.db.Instance.user.update({ where: { id: user.id }, data: { name: req.body.userNickname, description: req.body.userDescription } });

            res.json({ ok: true });
        }
        catch (error) {
            res.json({ ok: false, error: error });
        }

        if (req.file)
            fs.unlinkSync(`${req.file?.path}`);
    }

    @MapRoute('/api/deleteuser', MVCRouteMethod.DELETE)
    async DeleteUser(req: Request, res: Response) {
        try {
            let user = await this.auth.Auth(req, res);

            this.dataManager.DeleteUserData(user.id);

            await this.db.DeteleUser(user.id);

            res.clearCookie("jwt");

            res.json({ ok: true });
        }
        catch (error) {
            res.json({ ok: false, error: error });
        }
    }
}

export default UserEditorController;