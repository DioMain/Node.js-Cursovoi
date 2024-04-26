import DataBase from "../DataBase";
import { DataManager } from "../DataManager";
import { Controller, MVCController, MapPost } from "../MVC"
import AuthService from "../AuthService";
import { Request, Response } from "express";
import FilterBase from "../filters/FilterBase";
import { game } from "@prisma/client";
import PriceFilter from "../filters/PriceFilter";
import TagFilter from "../filters/TagFilter";
import Server from "../Server";
import { Application } from "express-ws";

class CatalogGetGameModel {
    namePattern: string = "";
    page: number = 1;

    filters: Array<{ tag: string, data: any }> = [];
}

@Controller
class CatalogController extends MVCController {
    private db: DataBase;
    private dataManager: DataManager;
    private server: Server;
    private auth: AuthService;

    private filters: Array<FilterBase<game>>;

    public PageSize: number = 6;

    constructor() {
        super();

        this.db = this.UseDependency("DataBase");
        this.dataManager = this.UseDependency("Data");
        this.auth = this.UseDependency("Auth");
        this.server = this.UseDependency("Server");

        this.filters = new Array<FilterBase<game>>();

        this.filters.push(new TagFilter("tag"));
        this.filters.push(new PriceFilter("price"));
    }

    @MapPost('/api/catalog/getgames')
    async GetGames(req: Request, res: Response) {
        let data = req.body as CatalogGetGameModel;

        let games: game[];

        if (data.namePattern === "")
            games = await this.db.GetGames();
        else
            games = await this.db.GetGamesByName(data.namePattern);

        games = games.filter(game => {
            if (game.state == 1)
                return true;

            return false;
        });

        this.filters.forEach(filter => {
            data.filters.forEach(filterdata => {
                if (filter.Tag === filterdata.tag)
                    games = filter.filter(games, filterdata.data);
            });
        });

        const preparedGames = games.map((game) => DataBase.PrepareGameInformation(game)).filter((value, index) => {
            if (index < (data.page - 1) * this.PageSize || index >= data.page * this.PageSize)
                return false;

            return true;
        });

        res.json({ ok: true, games: preparedGames, pages: Math.ceil(games.length / this.PageSize) });
    }
}

export default CatalogController;