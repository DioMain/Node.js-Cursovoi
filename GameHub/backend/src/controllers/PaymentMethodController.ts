import { Request, Response } from "express";
import { Controller, MVCController, MapGet, MapPost } from "../MVC";
import DataBase from "../DataBase";
import { JwtPayload } from "jsonwebtoken";
import { JsonObject } from "@prisma/client/runtime/library";
import AuthService from "../AuthService";

@Controller
class PaymentMethodController extends MVCController {

    public db: DataBase;
    public auth: AuthService;

    constructor() {
        super();

        this.db = this.UseDependency("DataBase");
        this.auth = this.UseDependency("Auth");
    }

    @MapGet('/api/getpminfo')
    async GetPMInfo(req: Request, res: Response) {
        try {
            let user = await this.auth.Auth(req, res);

            let wallet = await this.db.Instance.paymentmethod.findFirst({ where: { User: user?.id, type: 0 } });
            let cart = await this.db.Instance.paymentmethod.findFirst({ where: { User: user?.id, type: 1 } });

            if (wallet == null && user)
                await this.db.Instance.paymentmethod.create({ data: { User: user.id, type: 0, currency: "USD" } })

            let cartNumber = undefined;

            if (cart) {
                cartNumber = (cart.specialinformation as JsonObject).number;
            }

            res.json({ ok: true, walletUSD: user?.walletusd, cart: cartNumber });
        } catch (error) {
            res.json({ ok: false, error: error });
        }
    }

    @MapPost('/api/tool/addmoney')
    async AddMoney(req: Request, res: Response) {
        try {
            let user = await this.auth.Auth(req, res);

            let wallet = await this.db.Instance.paymentmethod.findFirst({ where: { User: user?.id, type: 0 } });

            if (wallet == null && user)
                await this.db.Instance.paymentmethod.create({ data: { User: user?.id, type: 0, currency: "USD" } });

            let money = Number.parseFloat(req.body.money);
            let walletUSD = user?.walletusd?.toNumber() as number;

            await this.db.Instance.user.update({ where: { id: user?.id }, data: { walletusd: walletUSD + money } });

            res.json({ ok: true });
        } catch (error) {
            res.json({ ok: false, error: error });
        }
    }

    @MapPost('/api/setusercart')
    async SetUserCart(req: Request, res: Response) {
        try {
            let user = await this.auth.Auth(req, res);

            let cart = await this.db.Instance.paymentmethod.findFirst({ where: { User: user?.id, type: 1 } });

            if (cart == null && user)
                await this.db.Instance.paymentmethod.create({ data: { User: user?.id, type: 1, currency: "ANY" } });

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
        } catch (error) {
            res.json({ ok: false, error: error });
        }
    }

    @MapGet('/api/unlinkusercart')
    async UnlinkCart(req: Request, res: Response) {
        try {
            let user = await this.auth.Auth(req, res);

            let cart = await this.db.Instance.paymentmethod.findFirst({ where: { User: user.id, type: 1 } });

            if (cart) {
                await this.db.Instance.transaction.deleteMany({ where: { customerpaymentmethod: cart.id } });
                await this.db.Instance.transaction.deleteMany({ where: { vendorpaymentmethod: cart.id } });
                await this.db.Instance.paymentmethod.delete({ where: { id: cart.id } });

                res.json({ ok: true });
            }
            else throw "Cart is not exist";

        } catch (error) {
            console.log(error);
            res.json({ ok: false, error: error });
        }
    }
}

export default PaymentMethodController;