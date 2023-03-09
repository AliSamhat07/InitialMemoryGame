import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "../features/gameSlice";
export const store = configureStore({
  reducer: {
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
