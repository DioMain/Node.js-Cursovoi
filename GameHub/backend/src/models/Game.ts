enum GameState {
    NotReady = 0, Active = 1, Blocked = 2
}

class Game {
    id?: number;
    company?: number;
    name?: string;
    description?: string;
    tags?: string;
    state?: GameState;
    priceUSD?: number;
}

export { Game, GameState };