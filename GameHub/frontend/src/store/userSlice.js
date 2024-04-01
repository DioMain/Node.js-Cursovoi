import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: { init: false, auth: false, data: undefined },
    reducers: {
        setUser(state, action) {
            state.auth = action.payload.auth;
            state.init = action.payload.init;
            state.data = action.payload.data;
        }
    }
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;