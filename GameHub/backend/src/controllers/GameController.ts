import { Request, Response } from "express";
import DataBase from "../DataBase";
import { DataManager, GameData } from "../DataManager";
import { Controller, MVCController, MVCRouteMethod, MapGet, MapRoute } from "../MVC";
import Server from "../Server";
import { JwtPayload } from "jsonwebtoken";
import fs from "fs";
import { game } from "@prisma/client";
import AuthService from "../AuthService";

@Controller
class GameController extends MVCController {

    public db: DataBase;
    public dataManager: DataManager;
    public server: Server;
    public auth: AuthService;

    constructor() {
        super();

        this.db = this.UseDependency("DataBase");
        this.dataManager = this.UseDependency("Data");
        this.auth = this.UseDependency("Auth");
        this.server = this.UseDependency("Server");

        this.server.App.post('/api/uploadgame', this.server.Multer.array('files'), this.UploadGame.bind(this));
        this.server.App.put('/api/editgame', this.server.Multer.array('files'), this.EditGame.bind(this));
    }

    async UploadGame(req: Request, res: Response) {
        let files = req.files as Express.Multer.File[];

        try {
            let user = await this.auth.Auth(req);

            let gamef = new GameData();

            let splitedName = files[3].originalname.split('.');

            gamef.GameFilePath = `${files[3].path}`;
            gamef.GameFileExtention = splitedName[splitedName.length - 1];

            gamef.IconImagePath = files[0].path;
            gamef.CartImagePath = files[1].path;
            gamef.LibriaryImagePath = files[2].path;

            let game = await this.db.Instance.game.create({
                data: {
                    name: req.body.name, description: req.body.description,
                    tags: req.body.tags, priceusd: req.body.price, User: user.id
                }
            });

            gamef.GameID = game.id;

            this.dataManager.SetGameData(gamef);

            res.json({ ok: true });
        } catch (error) {
            res.json({ ok: false, error: error });
        }

        fs.unlinkSync(files[0].path);
        fs.unlinkSync(files[1].path);
        fs.unlinkSync(files[2].path);
        fs.unlinkSync(files[3].path);
    }

    @MapGet('/api/getgamesbyuser')
    async GetGamesByUser(req: Request, res: Response) {
        try {
            let user = await this.auth.Auth(req);

            let games = await this.db.Instance.game.findMany({ where: { User: user.id } });

            const gamesWithPath = games.map(game => {
                return {
                    id: game.id,
                    name: game.name,
                    description: game.description,
                    priceusd: game.priceusd,
                    state: game.state,
                    User: game.User,
                    tags: game.tags,
                    iconImageUrl: `/games/${game.id}/iconimage.png`,
                    cartImageUrl: `/games/${game.id}/cartimage.png`,
                    libImageUrl: `/games/${game.id}/libimage.png`,
                }
            });

            res.json({ ok: true, games: gamesWithPath });
        } catch (error) {
            res.json({ ok: false, error: error });
        }
    }

    @MapGet('/api/getgameinfo')
    async GetGameInfo(req: Request, res: Response) {
        let game = await this.db.Instance.game.findFirst({ where: { id: Number.parseInt(req.query.id as string) } });

        if (game) {
            const gamesWithPath = {
                id: game.id,
                name: game.name,
                description: game.description,
                priceusd: game.priceusd,
                state: game.state,
                User: game.User,
                tags: game.tags,
                iconImageUrl: `/games/${game.id}/iconimage.png`,
                cartImageUrl: `/games/${game.id}/cartimage.png`,
                libImageUrl: `/games/${game.id}/libimage.png`,
            }

            res.json({ ok: true, game: gamesWithPath });
        }
        else
            res.json({ ok: false, error: "Game not found" });
    }

    async EditGame(req: Request, res: Response) {
        let files = req.files as Express.Multer.File[];

        try {
            let user = await this.auth.Auth(req);

            let oldgame = await this.db.Instance.game.findFirst({ where: { id: req.body.id } }) as game;

            if (oldgame.User == user.id) {
                let gamef = new GameData();

                if (files[3]) {
                    let splitedName = files[3].originalname.split('.');

                    gamef.GameFilePath = `${files[3].path}`;
                    gamef.GameFileExtention = splitedName[splitedName.length - 1];
                }
                else
                    gamef.GameFilePath = undefined;

                if (files[0])
                    gamef.IconImagePath = files[0].path;
                else
                    gamef.IconImagePath = undefined;

                if (files[1])
                    gamef.CartImagePath = files[1].path;
                else
                    gamef.CartImagePath = undefined;

                if (files[2])
                    gamef.LibriaryImagePath = files[2].path;
                else
                    gamef.LibriaryImagePath = undefined;

                let game = await this.db.Instance.game.update({
                    where: {
                        id: req.body.id
                    },
                    data: {
                        name: req.body.name, description: req.body.description,
                        tags: req.body.tags, priceusd: req.body.price, User: user.id
                    }
                });

                gamef.GameID = game.id;

                this.dataManager.SetGameData(gamef);

                res.json({ ok: true });
            }
            else throw "Uncorrect user";

        } catch (error) {
            res.json({ ok: false, error: error });
        }

        if (files[0])
            fs.unlinkSync(files[0].path);

        if (files[1])
            fs.unlinkSync(files[1].path);

        if (files[2])
            fs.unlinkSync(files[2].path);

        if (files[3])
            fs.unlinkSync(files[3].path);
    }

    @MapRoute('/api/deletegame', MVCRouteMethod.DELETE)
    async DeleteGame(req: Request, res: Response) {
        try {
            let user = await this.auth.Auth(req);

            let game = await this.db.Instance.game.findFirst({ where: { id: Number.parseInt(req.query.id as string) } }) as game;

            if (game.User == user.id) {
                this.dataManager.DeleteGameData(game.id);

                await this.db.Instance.game.delete({ where: { id: game.id } });

                res.json({ ok: true });
            }
            else throw "Uncorrect user";

        }
        catch (error) {
            res.json({ ok: false, error: error });
        }
    }

    @MapGet('/api/downloadgame')
    async DownloadGame(req: Request, res: Response) {
        try {
            let user = await this.auth.Auth(req);

            let game = await this.db.Instance.game.findFirst({ where: { id: Number.parseInt(req.query.id as string) } }) as game;

            if (user?.role === "ADMIN" || (user?.role === "DEVELOPER" && game.User == user?.id)) {
    
                let gamedata = this.dataManager.GetGameData(game.id);
    
                res.download(`${gamedata?.GameFilePath}`);
            }
            else throw null;
        }
        catch (error) {
            res.redirect('/');
        }
    }
}

export default GameController;