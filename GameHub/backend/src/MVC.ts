import { RequestHandler, Response, Request } from "express";
import fs from "fs";
import Server from "./Server";
import { WebsocketRequestHandler } from "express-ws";

function Controller(constructor: Function) {
    MVCManager.LinkedControlles.push(constructor.prototype);
}

function MapRoute(url: string, mvcmethod: MVCRouteMethod) {
    return function (target: MVCController, method: string, descriptor: PropertyDescriptor) {
        MVCController.LinkedRoutes.push(MVCRoute.CreateB(url, mvcmethod, descriptor.value, target.constructor.name));
    }
}

function MapGet(url: string) {
    return function (target: MVCController, method: string, descriptor: PropertyDescriptor) {
        MVCController.LinkedRoutes.push(MVCRoute.CreateB(url, MVCRouteMethod.GET, descriptor.value, target.constructor.name));
    }
}

function MapPost(url: string) {
    return function (target: MVCController, method: string, descriptor: PropertyDescriptor) {
        MVCController.LinkedRoutes.push(MVCRoute.CreateB(url, MVCRouteMethod.POST, descriptor.value, target.constructor.name));

    }
}

function WebSocketRoute(url: string) {
    return function (target: MVCController, method: string, descriptor: PropertyDescriptor) {
        MVCController.LinkedRoutes.push(MVCRoute.CreateC(url, descriptor.value, target.constructor.name));
    }
}

function Dependency(tag: string) {
    return function (target: MVCController, propertyKey: string) {
        let value: Object | undefined;

        const getter = () => {
            if (value == undefined) {
                value = MVCManager.LinkedDependencies.get(tag);

                if (value == undefined)
                    console.log(`${tag} DEPENDENCY NOT FOUND!`);
            }

            return value;
        };

        const setter = (newVal: Object) => {
            value = newVal;
        };

        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter
        });
    }
}

class MVCRoute {
    public url: string = "";
    public method: MVCRouteMethod = MVCRouteMethod.GET;
    public action?: RequestHandler | WebsocketRequestHandler;
    public controller: string = "";
    public isWebSocket: boolean = false;

    static CreateA(url: string, method: MVCRouteMethod, action: RequestHandler): MVCRoute {
        let route = new MVCRoute();

        route.url = url;
        route.method = method;
        route.action = action;

        return route;
    }

    static CreateB(url: string, method: MVCRouteMethod, action: RequestHandler, controller: string): MVCRoute {
        let route = new MVCRoute();

        route.url = url;
        route.method = method;
        route.action = action;
        route.controller = controller;

        return route;
    }

    static CreateC(url: string, action: WebsocketRequestHandler, controller: string): MVCRoute {
        let route = new MVCRoute();

        route.url = url;
        route.action = action;
        route.controller = controller;
        route.isWebSocket = true;

        return route;
    }
}

enum MVCRouteMethod {
    GET, POST, PUT, DELETE
}

class MVCController {
    public manager?: MVCManager;

    public static LinkedRoutes: MVCRoute[] = [];

    public routes: MVCRoute[] = [];

    AddRoute(url: string, method: MVCRouteMethod, action: RequestHandler) {
        let route = new MVCRoute();

        route.url = url;
        route.method = method;
        route.action = action.bind(this);

        this.routes.push(route);
    }

    AddRouteWS(url: string, action: WebsocketRequestHandler) {
        let route = new MVCRoute();

        route.url = url;
        route.isWebSocket = true;
        route.action = action.bind(this);

        this.routes.push(route);
    }

    UseLinkedRoutes() {
        MVCController.LinkedRoutes.forEach(element => {
            if (element.controller === this.constructor.name) {
                if (!element.isWebSocket)
                    this.AddRoute(element.url, element.method, element.action as RequestHandler);
                else
                    this.AddRouteWS(element.url, element.action as WebsocketRequestHandler);
            }
        });
    }

    protected UseDependency<T>(tag: string) : T {
        return MVCManager.LinkedDependencies.get(tag) as T;
    }

    protected EndView(res: Response): void {
        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        res.write(fs.readFileSync("./public/index.html"));
        res.end();
    }
}

class MVCManager {
    public static LinkedControlles: Array<typeof MVCController> = new Array<typeof MVCController>();
    public static LinkedDependencies: Map<string, Object> = new Map<string, Object>();

    private server: Server;
    private controllers: Array<MVCController>;

    constructor(server: Server) {
        this.server = server;

        this.controllers = [];
    }

    public static AddDependency(tag: string, object: Object): void {
        MVCManager.LinkedDependencies.set(tag, object);
    }

    MapRoute(url: string, method: MVCRouteMethod, action: RequestHandler) {
        switch (method) {
            case MVCRouteMethod.GET:
                this.server.App.get(url, action);
                break;
            case MVCRouteMethod.POST:
                this.server.App.post(url, action);
                break;
            case MVCRouteMethod.PUT:
                this.server.App.put(url, action);
                break;
            case MVCRouteMethod.DELETE:
                this.server.App.delete(url, action);
                break;
        }
    }

    MapRouteWS(url: string, action: WebsocketRequestHandler) {
        console.log(`+WS: ${url}`);
        console.log(`+WS: ${action}`);

        this.server.WebSocket.app.ws(url, action);
    }

    UseLinkedCotrollers() {
        MVCManager.LinkedControlles.forEach(i => {
            let ctrl: MVCController = i.constructor();

            ctrl.manager = this;

            ctrl.UseLinkedRoutes();

            this.controllers.push(ctrl);
        });
    }

    UseController(controller: MVCController) {
        controller.manager = this;

        this.controllers.push(controller);
    }

    Build() {
        this.controllers.forEach(ctrl => {
            ctrl.routes.forEach(route => {
                if (route.url == undefined || route.action == undefined)
                    return;

                if (route.isWebSocket) {
                    this.MapRouteWS(route.url, route.action as WebsocketRequestHandler);
                }
                else {
                    if (route.method == undefined)
                        return;

                    this.MapRoute(route.url, route.method, route.action as RequestHandler);
                }
            });
        });
    }
}

export {
    MVCController, MVCManager, MVCRouteMethod,
    Controller, MapRoute, MapGet, MapPost, Dependency, WebSocketRoute
};