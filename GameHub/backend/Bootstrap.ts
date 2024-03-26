import DataBase from "./src/DataBase";
import Server from "./src/Server";
import fs from "fs";

const srv = new Server();

const db = new DataBase();

db.connect();

srv.App.get("/", (req, res) => {
    res.writeHead(200, { "content-type":"text/html" });
    res.write(fs.readFileSync("./public/index.html"));
    res.end();
});

srv.App.get("/api/test", async (req, res) => {
    let admin = await db.Instance.user.findFirst({ where: { name: "ADMIN" }});

    res.end(`${admin?.name} ${admin?.description} ${admin?.email} ${admin?.role}`);
});

srv.Listen(false);