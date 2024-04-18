import { Request, Response } from "express";
import AuthService from "../AuthService";
import DataBase from "../DataBase";
import { DataManager } from "../DataManager";
import { Controller, MVCController, MapGet } from "../MVC";
import Server from "../Server";

@Controller
class GameSeachController extends MVCController {

    public db: DataBase;
    public dataManager: DataManager;
    public server: Server;
    public auth: AuthService;

    private PageSize = 6;

    constructor() {
        super();

        this.db = this.UseDependency("DataBase");
        this.dataManager = this.UseDependency("Data");
        this.auth = this.UseDependency("Auth");
        this.server = this.UseDependency("Server");
    }

    @MapGet('/api/getgamesadmin')
    async GetGamesAdmin(req: Request, res: Response) {
        try {
            let user = await this.auth.Auth(req, res);

            if (user.role !== "ADMIN")
                throw "Access denied";

            let page = Number.parseInt(req.query.page as string);
            let name = req.query.name as string;
            let state = Number.parseInt(req.query.state as string);

            let games;

            if (state >= 0 && name !== "")
                games = await this.db.GetGamesByStateAndName(state, name);
            else if (state >= 0)
                games = await this.db.GetGamesByState(state);
            else if (name !== "")
                games = await this.db.GetGamesByName(name);
            else
                games = await this.db.GetGames();

            const preparedGames = games.map((game) => DataBase.PrepareGameInformation(game)).filter((value, index) => {
                if (index < (page - 1) * this.PageSize || index >= page * this.PageSize)
                    return false;

                return true;
            });

            res.json({ ok: true, games: preparedGames, pagesCount: Math.ceil(games.length / this.PageSize) });
        }
        catch (error) {
            res.json({ ok: false, error: error });
        }
    }
}

export default GameSeachController;