import { createSlice } from "@reduxjs/toolkit";

const gameSlice = createSlice({
    name: "game",
    initialState: { data: undefined },
    reducers: {
        setGame(state, action) {
            state.data = action.payload.data;
        }
    }
});

export const { setGame } = gameSlice.actions;

export default gameSlice.reducer;