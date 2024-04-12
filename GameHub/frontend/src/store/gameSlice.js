import { createSlice } from "@reduxjs/toolkit";

const gameSlice = createSlice({
    name: "game",
    initialState: { init: false, data: undefined },
    reducers: {
        setGame(state, action) {
            state.data = action.payload.data;
            state.init = action.payload.init;
        }
    }
});

export const { setGame } = gameSlice.actions;

export default gameSlice.reducer;