import fs from 'fs';
import path from 'path';

class UserData {
    public UserID?: number;
    
    public IconPath?: string;
}

class GameData {
    public GameID?: number;

    public GameFilePath?: string;
    public GameFileExtention?: string;

    public IconImagePath?: string;
    public CartImagePath?: string;
    public LibriaryImagePath?: string;
}

class GameDataMeta {
    GameFileExtention?: string
}

class DataManager {
    
    SetUserData(data: UserData) {
        const sdir = `./static/users/${data.UserID}`;

        if (data.IconPath == undefined)
            return;

        try {
            if (!this.HasDirectory(sdir))
                fs.mkdirSync(sdir);

            fs.writeFileSync(`${sdir}/icon.png`, fs.readFileSync(`${data.IconPath}`));
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

            if (data.IconImagePath != undefined)
                fs.writeFileSync(`${sdir}/iconimage.png`, fs.readFileSync(`${data.IconImagePath}`));
            
            if (data.GameFilePath != undefined && data.GameFileExtention != undefined)
                fs.writeFileSync(`${ddir}/gamefile.${data.GameFileExtention}`, fs.readFileSync(`${data.GameFilePath}`));

            if (data.CartImagePath != undefined)
                fs.writeFileSync(`${sdir}/cartimage.png`, fs.readFileSync(`${data.CartImagePath}`));

            if (data.LibriaryImagePath != undefined)
                fs.writeFileSync(`${sdir}/libimage.png`, fs.readFileSync(`${data.LibriaryImagePath}`));

            let meta = new GameDataMeta();

            meta.GameFileExtention = data.GameFileExtention;

            fs.writeFileSync(`${ddir}/meta.json`, JSON.stringify(meta));
        }
        catch (err) {
            console.log(err);
        }
    }

    GetUserData(id: number): UserData | undefined {
        const sdir = `./static/users/${id}`;

        try {
            if (!this.HasDirectory(sdir))
                return undefined;

            let data = new UserData();

            data.UserID = id;

            data.IconPath = `${sdir}/iconpath.png`;

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

            let meta = JSON.parse(fs.readFileSync(`${ddir}/meta.json`).toString()) as GameDataMeta;
            
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