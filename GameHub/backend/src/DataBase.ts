import { PrismaClient, game } from "@prisma/client";

class DataBase {

    Instance: PrismaClient

    constructor() {
        this.Instance = new PrismaClient();
    }

    connect() { this.Instance.$connect(); }

    close() { this.Instance.$disconnect(); }

    async GetUser(id: number) {
        return await this.Instance.user.findFirst({ where: { id: id } });
    }

    async GetGame(id: number) {
        return await this.Instance.game.findFirst({ where: { id: id }, include: { sale_sale_gameTogame: true } });
    }

    async DeteleUser(id: number) {

        (await this.Instance.game.findMany({ where: { User: id } }))
            .forEach(async game => await this.DeteleGame(game.id));

        await this.Instance.paymentmethod.deleteMany({ where: { User: id } });
        await this.Instance.review.deleteMany({ where: { User: id } });

        await this.Instance.user.delete({ where: { id: id } });
    }

    async DeteleGame(id: number) {
        await this.Instance.sale.deleteMany({ where: { game: id } });

        await this.Instance.review.deleteMany({ where: { game: id } });

        await this.Instance.transaction.deleteMany({ where: { game: id } });

        await this.Instance.game.delete({ where: { id: id } });
    }

    async GetGamesByIds(gamesIds: Array<number>) {
        let games = new Array<game>();

        gamesIds.forEach(async i => {
            let game = await this.Instance.game.findFirst({ where: { id: i } });

            games.push(game as game);
        });

        return games;
    }

    async GetGames() {
        return await this.Instance.game.findMany({
            include: { sale_sale_gameTogame: true }
        });
    }

    async GetGamesByStateAndName(state: number, name: string) {
        return await this.Instance.game.findMany({ 
            where: {
                name: {
                    startsWith: name
                },
                state: state
            },
            include: { sale_sale_gameTogame: true }
        });
    }

    async GetGamesByState(state: number) {
        return await this.Instance.game.findMany({ 
            where: {
                state: state
            },
            include: { sale_sale_gameTogame: true }
        });
    }

    async GetGamesByName(name: string) {
        return await this.Instance.game.findMany({ 
            where: {
                name: {
                    startsWith: name
                }
            },
            include: { sale_sale_gameTogame: true }
        });
    }
}

export default DataBase;