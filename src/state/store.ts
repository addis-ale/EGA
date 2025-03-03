import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import createPostReducer from "./features/createPostSlice"; // Your persisted slice
import currentUserState from "./features/currentUserSlice"; // User state slice
import { productApi } from "./features/productApi";
import { wishlistApi } from "./features/whishlistApi";
import { cartApi } from "./features/cartApi";

// Configuration for Redux Persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["createPost", "currentUser"], // Persisted reducers
};

// Combine reducers
const rootReducer = combineReducers({
  createPost: createPostReducer, // Persisted reducer
  currentUser: currentUserState, // Persisted reducer
  [productApi.reducerPath]: productApi.reducer,
  [wishlistApi.reducerPath]: wishlistApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
});

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializability check for redux-persist
    }).concat(
      productApi.middleware,
      wishlistApi.middleware,
      cartApi.middleware
    ), // Add both middlewares
});

// Persistor for the store
export const persistor = persistStore(store);

// TypeScript types for store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
