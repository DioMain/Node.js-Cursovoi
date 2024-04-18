import AppController from "./controllers/AppController";
import CatalogController from "./controllers/CatalogController";
import GameController from "./controllers/GameController";
import GameSeachController from "./controllers/GameSeachController";
import PaymentMethodController from "./controllers/PaymentMethodController";
import SaleController from "./controllers/SaleController";
import UserController from "./controllers/UserController";
import UserEditorController from "./controllers/UserEditorController";

export default function () {
    AppController;
    UserController;
    UserEditorController;
    PaymentMethodController;
    GameController;
    SaleController;
    GameSeachController;
    CatalogController;
}