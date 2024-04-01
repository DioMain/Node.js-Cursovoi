import { Request, Response } from "express";
import { Controller, Dependency, MVCController, MapGet } from "../MVC";
import JwtManager from "../JwtManager";
import { JwtPayload } from "jsonwebtoken";

@Controller
class AppController extends MVCController {
    @MapGet('/')
    Index(req: Request, res: Response) {
        this.EndView(res);
    }
}

export default AppController;