import { PrismaClient, game, review, user } from "@prisma/client";
import { DataManager } from "./DataManager";

class DataBase {

    Instance: PrismaClient

    private data: DataManager

    constructor(data: DataManager) {
        this.Instance = new PrismaClient();

        this.data = data; 
    }

    connect() { this.Instance.$connect(); }

    close() { this.Instance.$disconnect(); }

    async GetUser(id: number) {
        return await this.Instance.user.findFirst({ where: { id: id } });
    }

    async GetGame(id: number) {
        return await this.Instance.game.findFirst({ 
            where: { id: id }, 
            include: { sale_sale_gameTogame: true, review_review_gameTogame: true }
        });
    }

    async DeteleUser(id: number) {

        this.data.DeleteUserData(id);

        (await this.Instance.game.findMany({ where: { User: id } }))
            .forEach(async game => await this.DeteleGame(game.id));

        await this.Instance.paymentmethod.deleteMany({ where: { User: id } });
        await this.Instance.review.deleteMany({ where: { User: id } });

        await this.Instance.user.delete({ where: { id: id } });
    }

    async DeteleGame(id: number) {
        this.data.DeleteGameData(id);

        await this.Instance.sale.deleteMany({ where: { game: id } });

        await this.Instance.review.deleteMany({ where: { game: id } });

        await this.Instance.transaction.deleteMany({ where: { game: id } });

        await this.Instance.game.delete({ where: { id: id } });
    }

    async GetGamesByIds(gamesIds: Array<number>) {
        let games = new Array<game>();

        for (let i = 0; i < gamesIds.length; i++) {
            games.push(await this.GetGame(gamesIds[i]) as game);  
        }

        return games;
    }

    async GetGames() {
        return await this.Instance.game.findMany({
            include: { sale_sale_gameTogame: true, review_review_gameTogame: true }
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
            include: { sale_sale_gameTogame: true, review_review_gameTogame: true }
        });
    }

    async GetGamesByState(state: number) {
        return await this.Instance.game.findMany({ 
            where: {
                state: state
            },
            include: { sale_sale_gameTogame: true, review_review_gameTogame: true }
        });
    }

    async GetGamesByName(name: string) {
        return await this.Instance.game.findMany({ 
            where: {
                name: {
                    startsWith: name
                }
            },
            include: { sale_sale_gameTogame: true, review_review_gameTogame: true }
        });
    }

    async GetGameReviews(gameId: number) {

        let reviews = await this.Instance.review.findMany({ where: { game: gameId }, include: { user: true } });

        return reviews.map(item => {
            return {
                text: item.text,
                mark: item.mark,
                username: item.user.name,
                usericon: `/users/${item.user.id}/icon.png`
            }
        });
    }

    public static PrepareGameInformation(game: game) {
        let reviews = (game as any).review_review_gameTogame as review[];

        let middleMark = -1;

        if (reviews && reviews.length > 0) {
            middleMark = 0;

            reviews.forEach(review => {
                middleMark += review.mark
            });

            middleMark = middleMark / reviews.length;
        }

        const gamesWithPath = {
            id: game.id,
            name: game.name,
            description: game.description,
            priceusd: game.priceusd,
            state: game.state,
            User: game.User,
            tags: game.tags,
            iconImageUrl: `/games/${game.id}/iconimage.png`,
            cartImageUrl: `/games/${game.id}/cartimage.png`,
            libImageUrl: `/games/${game.id}/libimage.png`,
            sale: (game as any).sale_sale_gameTogame[0],
            middleMark: middleMark
        }

        return gamesWithPath;
    }

    public static PrepareUserInformation(user: user) {

        const userPrep = {
            id: user.id,
            name: user.name,
            description: user.description,
            icon: `/users/${user.id}/icon.png`
        }

        return userPrep;
    }
}

export default DataBase;