import { JwtPayload } from "jsonwebtoken";
import DataBase from "../DataBase";
import JwtManager from "../JwtManager";
import { Controller, Dependency, MVCController, MVCManager, MapGet, MapPost } from "../MVC";
import { Request, Response, response } from "express";
import { DataManager, UserData } from "../DataManager";
import PasswordHasher from "../PasswordHasher";
import AuthService from "../AuthService";


@Controller
class UserController extends MVCController {
    public db: DataBase;
    public localData: DataManager;
    public jwt: JwtManager;
    public hasher: PasswordHasher;
    public auth: AuthService;

    constructor() {
        super();

        this.db = this.UseDependency("DataBase");
        this.jwt = this.UseDependency("Jwt");
        this.localData = this.UseDependency("Data");
        this.hasher = this.UseDependency("PasswordHasher");
        this.auth = this.UseDependency("Auth");
    }

    @MapGet('/api/auth')
    async Auth(req: Request, res: Response) {
        try {
            let user = await this.auth.Auth(req, res);
            let userData = this.localData.GetUserData(user.id);

            res.json({ auth: true, data: { id: user.id, name: user.name, email: user.email, description: user.description, role: user.role, games: userData?.Games, walletusd: user.walletusd } });
        }
        catch (error) {
            res.clearCookie('ajwt');
            res.clearCookie('rjwt');
            
            res.json({ auth: false });
        }
    }

    @MapPost('/api/login')
    async Login(req: Request, res: Response) {
        try {
            let user = await this.db.Instance.user.findFirst({
                where: {
                    email: req.body.email, password: this.hasher.HashPassword(req.body.password)
                }
            });

            if (user == null)
                throw "Не верный пользователь или пароль!";

            let atoken = this.jwt.GenerateAccessToken(user?.id as number);
            let rtoken = this.jwt.GenerateRefreshToken(user?.id as number);

            await this.db.Instance.user.update({ where: { id: user.id }, data: { rjwt: rtoken } });

            res.cookie("ajwt", atoken);
            res.cookie("rjwt", rtoken);

            res.json({ success: true });
        }
        catch (error) {
            res.json({ success: false, error: error });
        }
    }

    @MapPost('/api/register')
    async Registration(req: Request, res: Response) {
        try {
            let checkedUser = await this.db.Instance.user.findFirst({
                where: {
                    email: req.body.email
                }
            });

            if (checkedUser != null)
                throw "Пользователь с такой почтой уже существует!";

            await this.db.Instance.user.create({
                data: {
                    email: req.body.email, name: req.body.nickname, password: this.hasher.HashPassword(req.body.password),
                    role: req.body.role
                }
            });

            let user = await this.db.Instance.user.findFirst({
                where: {
                    email: req.body.email
                }
            });

            if (user) {
                await this.db.Instance.paymentmethod.create({ data: { User: user.id, type: 0, currency: "USD" } });
            }

            let nuserdata = new UserData();

            nuserdata.UserID = user?.id;
            nuserdata.IconPath = './static/images/UnknownUser.png';
            nuserdata.Games = [];

            this.localData.SetUserData(nuserdata);

            let atoken = this.jwt.GenerateAccessToken(user?.id as number);
            let rtoken = this.jwt.GenerateRefreshToken(user?.id as number);

            res.cookie("ajwt", atoken);
            res.cookie("rjwt", rtoken);

            res.json({ success: true });
        }
        catch (error) {
            res.json({ success: false, error: error });
        }
    }

    @MapGet('/api/logout')
    Logout(req: Request, res: Response) {
        res.clearCookie("ajwt");
        res.clearCookie("rjwt");

        res.redirect("/");
    }
}

export default UserController;