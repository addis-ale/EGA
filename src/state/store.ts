import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import createPostReducer from "./features/createPostSlice"; // Your persisted slice
import currentUserState from "./features/currentUserSlice"; // Non-persisted slice
import { combineReducers } from "redux";

// Configuration for Redux Persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["createPost"], // Only persist createPost
};

// Combine reducers
const rootReducer = combineReducers({
  createPost: createPostReducer, // Persisted reducer
  currentUser: currentUserState, // Non-persisted reducer
});

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
export const store = configureStore({
  reducer: persistedReducer,
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
