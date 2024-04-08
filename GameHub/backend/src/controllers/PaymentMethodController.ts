import { Request, Response } from "express";
import { Controller, MVCController, MapGet, MapPost } from "../MVC";
import DataBase from "../DataBase";
import JwtManager from "../JwtManager";
import { JwtPayload } from "jsonwebtoken";
import { JsonObject } from "@prisma/client/runtime/library";

@Controller
class PaymentMethodController extends MVCController {

    public db: DataBase;
    public jwt: JwtManager;

    constructor() {
        super();

        this.db = this.UseDependency("DataBase");
        this.jwt = this.UseDependency("Jwt");
    }

    @MapGet('/api/getpminfo')
    async GetPMInfo(req: Request, res: Response) {
        if (this.jwt.IsValidToken(req.cookies.jwt)) {
            let data = this.jwt.AuthenticateToken(req.cookies.jwt) as JwtPayload;

            let user = await this.db.Instance.user.findFirst({ where: { id: data.userId } });

            let wallet = await this.db.Instance.paymentmethod.findFirst({ where: { User: user?.id, type: 0 } });
            let cart = await this.db.Instance.paymentmethod.findFirst({ where: { User: user?.id, type: 1 } });

            if (wallet == null && user)
                await this.db.Instance.paymentmethod.create({ data: { User: user.id, type: 0, currency: "USD" } })

            let cartNumber = undefined;

            if (cart) {
                cartNumber = (cart.specialinformation as JsonObject).number;
            }

            res.json({ ok: true, walletUSD: user?.walletusd, cart: cartNumber });
        }
        else
            res.json({ ok: false, error: "jwt" });
    }

    @MapPost('/api/tool/addmoney')
    async AddMoney(req: Request, res: Response) {
        if (this.jwt.IsValidToken(req.cookies.jwt)) {
            let data = this.jwt.AuthenticateToken(req.cookies.jwt) as JwtPayload;

            let user = await this.db.Instance.user.findFirst({ where: { id: data.userId } });

            let wallet = await this.db.Instance.paymentmethod.findFirst({ where: { User: user?.id, type: 0 } });

            if (wallet == null && user)
                await this.db.Instance.paymentmethod.create({ data: { User: user?.id, type: 0, currency: "USD" } });

            let money = Number.parseFloat(req.body.money);
            let walletUSD = user?.walletusd?.toNumber() as number;

            await this.db.Instance.user.update({ where: { id: user?.id }, data: { walletusd: walletUSD + money } });

            res.json({ ok: true });
        }
        else
            res.json({ ok: false, error: "jwt" });
    }

    @MapPost('/api/setusercart')
    async SetUserCart(req: Request, res: Response) {
        if (this.jwt.IsValidToken(req.cookies.jwt)) {
            let data = this.jwt.AuthenticateToken(req.cookies.jwt) as JwtPayload;

            let user = await this.db.Instance.user.findFirst({ where: { id: data.userId } });

            let cart = await this.db.Instance.paymentmethod.findFirst({ where: { User: user?.id, type: 1 } });

            if (cart == null && user)
                await this.db.Instance.paymentmethod.create({ data: { User: user?.id, type: 1, currency: "ANY" } });

            try {
                await this.db.Instance.paymentmethod.updateMany({
                    where: { User: user?.id, type: 1 },
                    data: {
                        specialinformation: {
                            number: req.body.number,
                            date: req.body.date,
                            cvv2: req.body.cvv,
                        }
                    }
                });

                res.json({ ok: true });
            }
            catch (err) {
                res.json({ ok: false, error: err });
            }
        }
        else
            res.json({ ok: false, error: "jwt" });
    }

    @MapGet('/api/unlinkusercart')
    async UnlinkCart(req: Request, res: Response) {
        if (this.jwt.IsValidToken(req.cookies.jwt)) {
            let data = this.jwt.AuthenticateToken(req.cookies.jwt) as JwtPayload;

            let user = await this.db.Instance.user.findFirst({ where: { id: data.userId } });
            let cart = await this.db.Instance.paymentmethod.findFirst({ where: { User: user?.id, type: 1 } });

            if (cart) {
                await this.db.Instance.paymentmethod.delete({ where: { id: cart.id }});
            }

            res.json({ ok: true });
        }
        else
            res.json({ ok: false, error: "jwt" });
    }
}

export default PaymentMethodController;