import { configureStore } from '@reduxjs/toolkit';

import userReducer from './userSlice';
import gameSlice from './gameSlice';

export default configureStore({
    reducer: {
        user: userReducer,
        game: gameSlice
    }
});