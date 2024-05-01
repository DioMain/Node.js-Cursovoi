import { Request, Response } from "express";
import AuthService from "../AuthService";
import DataBase from "../DataBase";
import { DataManager, UserData } from "../DataManager";
import { Controller, MVCController, MapPost, WebSocketRoute } from "../MVC";
import Server from "../Server";
import * as ws from "ws";
import { paymentmethod, user } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

class ReviewWSConnection {
    socket: ws;
    gameId: number;

    constructor(socket: any, gameId: number) {
        this.socket = socket;
        this.gameId = gameId;
    }
}

class ReviewModel {
    game?: number;
    User?: number;
    text?: string;
    mark?: number;
}

@Controller
class GamePageController extends MVCController {
    private db: DataBase;
    private dataManager: DataManager;
    private server: Server;
    private auth: AuthService;

    private wsConnections: ReviewWSConnection[];

    constructor() {
        super();

        this.db = this.UseDependency("DataBase");
        this.dataManager = this.UseDependency("Data");
        this.auth = this.UseDependency("Auth");
        this.server = this.UseDependency("Server");

        this.wsConnections = new Array<ReviewWSConnection>();

        this.server.WebSocket.app.ws('/game/reviews/*', this.ReviewsWS.bind(this));
    }

    //@WebSocketRoute('/game/reviews/*')
    async ReviewsWS(ws: ws, req: Request) {
        let gameId = Number.parseInt(req.path.split('/')[3]);

        this.wsConnections.push(new ReviewWSConnection(ws, gameId));

        ws.onmessage = async (mes) => {
            let review = JSON.parse(mes.data as string) as ReviewModel;

            let connections = this.wsConnections.filter(con => con.gameId == review.game);

            let oldReview = await this.db.Instance.review.findFirst({ where: { User: review.User, game: review.game } });

            if (oldReview)
                await this.db.Instance.review.update({
                    data: { text: review.text, mark: review.mark },
                    where: { id: oldReview.id }
                });
            else
                await this.db.Instance.review.create({
                    data: {
                        User: review.User as number, game: review.game as number,
                        text: review.text as string, mark: review.mark as number
                    }
                });

            let reviews = JSON.stringify(await this.db.GetGameReviews(gameId));

            connections.forEach(con => {
                con.socket.send(reviews);
            })
        };

        ws.onerror = (error) => console.log(error.message);

        ws.onclose = (evt) => {
            let index = this.wsConnections.findIndex(value => value.socket == evt.target);
            this.wsConnections.splice(index, 1);
        };

        ws.send(JSON.stringify(await this.db.GetGameReviews(gameId)));
    }

    @MapPost('/api/buygame')
    async BuyGame(req: Request, res: Response) {
        try {
            let user = await this.auth.Auth(req, res);

            let game = await this.db.GetGame(req.body.game);

            if (!game)
                throw "Game is not exists!";

            let developer = await this.db.Instance.user.findFirst({
                where: { id: game.User }, include: { paymentmethod: true }
            });

            let developerCart = developer?.paymentmethod.find(item => item.type == 1);

            let gameRealPrice = game.sale_sale_gameTogame[0] ? (game.priceusd.toNumber() * (1 - (game.sale_sale_gameTogame[0].percent as number))) : game.priceusd.toNumber();

            let userData = this.dataManager.GetUserData(user.id) as UserData;

            if (userData.Games?.some(i => i == game.id))
                throw "Игра уже есть в библиотеке!";

            if (gameRealPrice > 0) {
                if (!developerCart)
                    throw "Разработчик не может совершить транзакцию!";

                let userMP = await this.db.Instance.paymentmethod.findFirst({ where: { User: user.id, type: req.body.pmtype } }) as paymentmethod;

                let userWallet = user.walletusd?.toNumber() as number;

                switch (req.body.pmtype) {
                    case 0:
                        if (userWallet < gameRealPrice)
                            throw "В кашельке не хватает средств!";
                        
                        await this.db.Instance.user.update({
                            where: { id: user.id },
                            data: { walletusd: userWallet - gameRealPrice }
                        });

                        break;
                    case 1:
                        if (!userMP)
                            throw "Отсутсвует карта!";

                        break;
                    default:
                        throw "Не существующий способ оплаты!";
                }

                await this.db.Instance.transaction.create({
                    data: { game: game.id, customerpaymentmethod: userMP.id, vendorpaymentmethod: developerCart.id }
                });

                userData.Games?.push(game.id);

                this.dataManager.SetUserData(userData);
            }
            else {
                userData.Games?.push(game.id);

                this.dataManager.SetUserData(userData);
            }

            console.log("Buy success!");

            res.json({ ok: true });
        }
        catch (error) {
            res.json({ ok: false, error: error });
        }
    }
}

export default GamePageController;