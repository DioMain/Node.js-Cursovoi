import { Request, Response } from "express";
import { Controller, MVCController, MapGet } from "../MVC";

@Controller
class AppController extends MVCController {
    @MapGet('/')
    Index(req: Request, res: Response) {
        this.EndView(res);
    }
}

export default AppController;