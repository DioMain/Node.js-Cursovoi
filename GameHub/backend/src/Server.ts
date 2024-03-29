import https from "https";
import express, { Express } from 'express';
import expressws, { Instance } from 'express-ws';
import express_session from 'express-session';
import multer, { Multer } from 'multer';
import fs from 'fs';

const options = {
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.crt')
};

class Server {

    public App : Express;
    public WebSocket : Instance;
    public Multer : Multer

    constructor() {
        this.App = express();
        this.WebSocket = expressws(this.App);

        this.Multer = multer({dest: './upload'});

        this.App.use(express.static("./static"));
        this.App.use(express.json());
        this.App.use(express_session({ saveUninitialized: false, secret: 'asge122tgd' }));
    }

    Listen(ishttps: boolean = false) {
        if (ishttps){
            https.createServer(options, this.App).listen(5000, () => {
                console.log("Https server listen on: https://localhost:5000/");
            });
        }
        else {
            this.App.listen(5000, () => {
                console.log("Http server listen on: http://localhost:5000/");
            });
        }
    }
}

export default Server;