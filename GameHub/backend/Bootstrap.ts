import ControllerImporter from "./src/ControllerImporter";
import DataBase from "./src/DataBase";
import Server from "./src/Server";
import { MVCManager } from "./src/MVC";
import { DataManager } from "./src/DataManager";
import PassowordHasher from "./src/PassowordHasher";
import JwtManager from "./src/JwtManager";
import AuthService from "./src/AuthService";

ControllerImporter();

const dataManager = new DataManager();
const database = new DataBase(dataManager);
const passwordHasher = new PassowordHasher("GAMEHUB");
const jwtManager = new JwtManager("AGAMEHUB", "BGAMEHUB");
const server = new Server(true);

MVCManager.AddDependency("Jwt", jwtManager);
MVCManager.AddDependency("PasswordHasher", passwordHasher);
MVCManager.AddDependency("Data", dataManager);
MVCManager.AddDependency("Server", server);
MVCManager.AddDependency("DataBase", database);

const auth = new AuthService(jwtManager, database);

database.connect();

MVCManager.AddDependency("Auth", auth);

let manager = new MVCManager(server);

manager.UseLinkedCotrollers();

manager.Build();

server.Listen();