import { PrismaClient } from "@prisma/client";

class DataBase {

    Instance: PrismaClient

    constructor() {
        this.Instance = new PrismaClient();
    }

    connect() { this.Instance.$connect(); }

    close() { this.Instance.$disconnect(); }
}

export default DataBase;