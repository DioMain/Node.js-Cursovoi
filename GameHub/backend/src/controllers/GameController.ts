import { Request, Response } from "express";
import DataBase from "../DataBase";
import { DataManager, GameData } from "../DataManager";
import JwtManager from "../JwtManager";
import { Controller, MVCController, MapGet } from "../MVC";
import Server from "../Server";
import { JwtPayload } from "jsonwebtoken";
import fs from "fs";

@Controller
class GameController extends MVCController {

    public db: DataBase;
    public dataManager: DataManager;
    public jwt: JwtManager;
    public server: Server;

    constructor() {
        super();

        this.db = this.UseDependency("DataBase");
        this.dataManager = this.UseDependency("Data");
        this.jwt = this.UseDependency("Jwt");
        this.server = this.UseDependency("Server");

        this.server.App.post('/api/uploadgame', this.server.Multer.array('files'), this.UploadGame.bind(this));
    }

    async UploadGame(req: Request, res: Response) {

        if (this.jwt.IsValidToken(req.cookies.jwt)) {

            let jwtdata = this.jwt.AuthenticateToken(req.cookies.jwt) as JwtPayload;

            let user = await this.db.GetUser(jwtdata.userId);

            if (user) {
                let files = req.files as Express.Multer.File[];

                let gamef = new GameData();

                let splitedName = files[3].originalname.split('.');

                gamef.GameFilePath = `${files[3].path}`;
                gamef.GameFileExtention = splitedName[splitedName.length - 1];

                gamef.IconImagePath = files[0].path;
                gamef.CartImagePath = files[1].path;
                gamef.LibriaryImagePath = files[2].path;

                let game = await this.db.Instance.game.create({ data: { 
                    name: req.body.name, description: req.body.description,
                    tags: req.body.tags, priceusd: req.body.price, User: user.id
                }});

                gamef.GameID = game.id;

                this.dataManager.SetGameData(gamef);

                fs.unlinkSync(files[0].path);
                fs.unlinkSync(files[1].path);
                fs.unlinkSync(files[2].path);
                fs.unlinkSync(files[3].path);

                res.json({ ok: true });
            }
            else {
                res.clearCookie('jwt');
                res.json({ ok: false, error: "User is not exists" });
            }
        }
        else
            res.json({ ok: false, error: "jwt" });
    }

    @MapGet('/api/getgamesbyuser')
    async GetGamesByUser(req: Request, res: Response) {
        if (this.jwt.IsValidToken(req.cookies.jwt)) {

            let jwtdata = this.jwt.AuthenticateToken(req.cookies.jwt) as JwtPayload;
            let user = await this.db.GetUser(jwtdata.userId);

            if (user) {
                let games = await this.db.Instance.game.findMany({ where: { User: user.id }});

                res.json({ ok: true, games: games });
            }
            else {
                res.clearCookie('jwt');
                res.json({ ok: false, error: "User is not exists" });
            }
        }
        else
            res.json({ ok: false, error: "jwt" });
    }
}

export default GameController;