import { configureStore } from "@reduxjs/toolkit";
import currentUserSlice from "./features/currentUserSlice";
export const store = configureStore({
  reducer: {
    currentUser: currentUserSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AddDispatch = typeof store.dispatch;
