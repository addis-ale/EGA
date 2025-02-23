import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import createPostReducer from "./features/createPostSlice"; // Import your slice
import currentUserState from "./features/currentUserSlice";
// Configuration for Redux Persist
const persistConfig = {
  key: "root",
  storage, // Use localStorage
};

// Wrap reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, createPostReducer);

// Create the store
export const store = configureStore({
  reducer: {
    createPost: persistedReducer,
    currentUser: currentUserState,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializability check for redux-persist
    }),
});

// Persistor for the store
export const persistor = persistStore(store);

// TypeScript types for store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
