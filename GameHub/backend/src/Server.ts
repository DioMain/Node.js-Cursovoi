import https from "https";
import express, { Express } from 'express';
import expressws, { Instance } from 'express-ws';
import expressSession from 'express-session';
import multer, { Multer } from 'multer';
import fs from 'fs';
import cookieParser from "cookie-parser";

const options = {
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.crt')
};

class Server {

    public App : Express;
    public WebSocket : Instance;
    public Multer : Multer;
    
    private isHttps: boolean;

    constructor(ishttps: boolean = false) {
        this.isHttps = ishttps;

        this.App = express();
        this.WebSocket = expressws(this.App);

        this.Multer = multer({dest: './upload'});

        this.App.use(express.static("./static"));
        this.App.use(express.json());
        this.App.use(cookieParser());
        this.App.use(expressSession({ saveUninitialized: false, secret: 'asge122tgd', cookie: { secure: ishttps }, resave: false }));
    }

    Listen() {
        if (this.isHttps){
            const srv = https.createServer(options, this.App).listen(5000, () => {
                console.log("Https server listen on: https://localhost:5000/");
            });

            this.WebSocket = expressws(this.App, srv);
        }
        else {
            this.App.listen(5000, () => {
                console.log("Http server listen on: http://localhost:5000/");
            });
        }
    }
}

export default Server;