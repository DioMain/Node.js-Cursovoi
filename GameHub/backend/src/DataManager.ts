import fs from 'fs';

class UserData {
    public UserID?: number;
    
    public IconPath?: string;

    public Games?: Array<Number>;
}

class GameData {
    public GameID?: number;

    public GameFilePath?: string;
    public GameFileExtention?: string;

    public IconImagePath?: string;
    public CartImagePath?: string;
    public LibriaryImagePath?: string;
}

class DataManager {
    
    SetUserData(data: UserData) {
        const sdir = `./static/users/${data.UserID}`;
        const ddir = `./data/users/${data.UserID}`;

        if (data.IconPath == undefined)
            return;

        try {
            if (!this.HasDirectory(sdir))
                fs.mkdirSync(sdir);

            if (!this.HasDirectory(ddir))
                fs.mkdirSync(ddir);

            if (data.IconPath)
                fs.writeFileSync(`${sdir}/icon.png`, fs.readFileSync(`${data.IconPath}`));

            if (data.Games)
                fs.writeFileSync(`${ddir}/meta.json`, JSON.stringify({ games: data.Games }));
        }
        catch (err) {
            console.log(err);
        }
    }

    SetGameData(data: GameData) {
        const ddir = `./data/games/${data.GameID}`;
        const sdir = `./static/games/${data.GameID}`;

        try {
            if (!this.HasDirectory(ddir))
                fs.mkdirSync(ddir);
            if (!this.HasDirectory(sdir))
                fs.mkdirSync(sdir);

            if (data.IconImagePath)
                fs.writeFileSync(`${sdir}/iconimage.png`, fs.readFileSync(`${data.IconImagePath}`));
            
            if (data.GameFilePath && data.GameFileExtention){
                fs.writeFileSync(`${ddir}/gamefile.${data.GameFileExtention}`, fs.readFileSync(`${data.GameFilePath}`));
                fs.writeFileSync(`${ddir}/meta.json`, JSON.stringify({ GameFileExtention: data.GameFileExtention }));
            }

            if (data.CartImagePath)
                fs.writeFileSync(`${sdir}/cartimage.png`, fs.readFileSync(`${data.CartImagePath}`));

            if (data.LibriaryImagePath)
                fs.writeFileSync(`${sdir}/libimage.png`, fs.readFileSync(`${data.LibriaryImagePath}`));

        }
        catch (err) {
            console.log(err);
        }
    }

    GetUserData(id: number): UserData | undefined {
        const sdir = `./static/users/${id}`;
        const ddir = `./data/users/${id}`;

        try {
            if (!this.HasDirectory(sdir) || !this.HasDirectory(ddir))
                return undefined;

            let data = new UserData();

            data.UserID = id;

            data.IconPath = `${sdir}/icon.png`;

            let meta = JSON.parse(fs.readFileSync(`${ddir}/meta.json`).toString());

            data.Games = meta.games;

            return data;
        }
        catch (err) {
            console.log(err);

            return undefined;
        }
    }

    GetGameData(id: number): GameData | undefined {
        const ddir = `./data/games/${id}`;
        const sdir = `./static/games/${id}`;

        try {
            if (!this.HasDirectory(sdir) || !this.HasDirectory(ddir))
                return undefined;

            let meta = JSON.parse(fs.readFileSync(`${ddir}/meta.json`).toString());
            
            let data = new GameData();

            data.GameID = id;
            data.GameFileExtention = meta.GameFileExtention;

            data.GameFilePath = `${ddir}/gamefile.${meta.GameFileExtention}`;
            data.IconImagePath = `${sdir}/iconimage.png`;
            data.CartImagePath = `${sdir}/cartimage.png`;
            data.LibriaryImagePath = `${sdir}/libimage.png`;

            return data;
        }
        catch (err) {
            console.log(err);

            return undefined;
        }
    }

    DeleteUserData(id: number) {
        const sdir = `./static/users/${id}`;
        const ddir = `./data/users/${id}`;

        try {
            fs.rmSync(sdir, { recursive: true });
            fs.rmSync(ddir, { recursive: true });
        }
        catch (err) {
            console.log(err);

            return undefined;
        }
    }

    DeleteGameData(id: number) {
        const sdir = `./static/games/${id}`;
        const ddir = `./data/games/${id}`;

        try {
            fs.rmSync(sdir, { recursive: true });
            fs.rmSync(ddir, { recursive: true });
        }
        catch (err) {
            console.log(err);

            return undefined;
        }
    }

    private HasDirectory(path: string): boolean {
        try {
            const stats = fs.statSync(path);

            return stats.isDirectory();

        } catch (error) {
            return false;
        }
    }
}

export { DataManager, UserData, GameData };