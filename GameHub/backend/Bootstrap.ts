import ControllerImporter from "./src/ControllerImporter";
import DataBase from "./src/DataBase";
import Server from "./src/Server";
import { MVCManager } from "./src/MVC";
import { DataManager } from "./src/DataManager";
import PassowordHasher from "./src/PassowordHasher";
import JwtManager from "./src/JwtManager";

ControllerImporter();

const database = new DataBase();
const dataManager = new DataManager();
const passwordHasher = new PassowordHasher("GAMEHUB");
const jwtManager = new JwtManager("GAMEHUB");
const server = new Server(false);

MVCManager.AddDependency("Jwt", jwtManager);
MVCManager.AddDependency("PasswordHasher", passwordHasher);
MVCManager.AddDependency("Data", dataManager);
MVCManager.AddDependency("Server", server);
MVCManager.AddDependency("DataBase", database);

database.connect();

let manager = new MVCManager(server);

manager.UseLinkedCotrollers();

manager.Build();

server.Listen();