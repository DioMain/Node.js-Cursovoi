import { Request, Response } from "express";
import { Controller, MVCController, MapGet } from "../MVC";

@Controller
class AppController extends MVCController {
    constructor() {
        super();
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

    @MapGet('/developer/editGame/*')
    Index4(req: Request, res: Response) {
        this.EndView(res);
    }

    @MapGet('/game/*')
    Index5(req: Request, res: Response) {
        this.EndView(res);
    }

    @MapGet('/libriary')
    Index6(req: Request, res: Response) {
        this.EndView(res);
    }

    @MapGet('/admin')
    Index7(req: Request, res: Response) {
        this.EndView(res);
    }
}

export default AppController;