import AuthService from "../AuthService";
import DataBase from "../DataBase";
import { DataManager } from "../DataManager";
import { MVCController } from "../MVC";
import Server from "../Server";

class GamePageController extends MVCController {
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
    }


}

export default GamePageController;