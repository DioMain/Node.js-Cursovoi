import AuthService from "../AuthService";
import DataBase from "../DataBase";
import { DataManager } from "../DataManager";
import { Controller, MVCController, MVCRouteMethod, MapPost, MapRoute } from "../MVC";
import Server from "../Server";
import { Request, Response } from "express";

@Controller
class SaleController extends MVCController {
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
    }

    
    @MapPost('/api/game/setsale')
    async SetSale(req: Request, res: Response) {
        try {
            let user = await this.auth.Auth(req);
            let game = await this.db.GetGame(req.body.gameId)

            if (game?.User == user.id) {
                let oldSale = await this.db.Instance.sale.findFirst({ where: { game: req.body.gameId } });

                if (oldSale)
                    throw "Already have";

                let datetime = new Date(req.body.untilto);

                await this.db.Instance.sale.create({ data: { game: game?.id, untilto: datetime.toISOString(), cause: req.body.cause, percent: Number.parseFloat(req.body.percent) } });
            }
            else throw "Uncorrect user";

            res.json({ ok: true });
        } catch (error) {
            res.json({ ok: false, error: error });
        }
    }

    @MapRoute('/api/game/dropsale', MVCRouteMethod.DELETE)
    async DropSale(req: Request, res: Response) {
        try {
            let user = await this.auth.Auth(req);
            let game = await this.db.GetGame(req.body.gameId)

            if (game?.User == user.id) {
                let oldSale = await this.db.Instance.sale.findFirst({ where: { game: game?.id } });

                if (!oldSale)
                    throw "Dont exist";

                await this.db.Instance.sale.delete({ where: { id: oldSale.id } });
            }
            else throw "Uncorrect user";

            res.json({ ok: true });
        } catch (error) {
            res.json({ ok: false, error: error });
        }
    }
}

export default SaleController;