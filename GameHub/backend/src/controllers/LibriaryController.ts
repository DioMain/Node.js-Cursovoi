import { Request, Response } from "express";
import AuthService from "../AuthService";
import DataBase from "../DataBase";
import { DataManager } from "../DataManager";
import { Controller, MVCController, MapGet, MapPost } from "../MVC";
import Server from "../Server";

@Controller
class LibriaryController extends MVCController {

    private db: DataBase;
    private dataManager: DataManager;
    private server: Server;
    private auth: AuthService;

    constructor() {
        super();

        this.db = this.UseDependency("DataBase");
        this.dataManager = this.UseDependency("Data");
        this.auth = this.UseDependency("Auth");
        this.server = this.UseDependency("Server");
    }

    @MapGet('/api/libriary/getusergames')
    async GetGames(req : Request, res : Response) {
        let userId = Number.parseInt(req.query.id as string);

        let userData = this.dataManager.GetUserData(userId);

        if (userData) {
            let games = (await this.db.GetGamesByIds(userData.Games as number[])).map(item => DataBase.PrepareGameInformation(item));

            res.json({ ok: true, games: games });
        }
        else 
            res.json({ ok: false })
    }

    @MapPost('/api/libriary/downloadgame')
    async DownloadGame(req : Request, res : Response) {
        
    }
}

export default LibriaryController;