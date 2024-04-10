import { Request, Response } from "express";
import { Controller, MVCController, MapGet } from "../MVC";
import Server from "../Server";
import JwtManager from "../JwtManager";
import { DataManager } from "../DataManager";
import DataBase from "../DataBase";

@Controller
class AppController extends MVCController {
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
    }

    @MapGet('/')
    Index0(req: Request, res: Response) {
        this.EndView(res);
    }

    @MapGet('/user')
    Index1(req: Request, res: Response) {
        this.EndView(res);
    }

    @MapGet('/developer')
    Index2(req: Request, res: Response) {
        this.EndView(res);
    }

    @MapGet('/developer/createGame')
    Index3(req: Request, res: Response) {
        this.EndView(res);
    }
}

export default AppController;