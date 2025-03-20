import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import currentUserState from "./features/currentUserSlice"; // User state slice
import { productApi } from "./features/productApi";
import { wishlistApi } from "./features/whishlistApi";
import { cartApi } from "./features/cartApi";
import { FilterApi } from "./features/filterApi";

// Configuration for Redux Persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["createPost", "currentUser"], // Persisted reducers
};

// Combine reducers
const rootReducer = combineReducers({
  currentUser: currentUserState, // Persisted reducer
  [productApi.reducerPath]: productApi.reducer,
  [wishlistApi.reducerPath]: wishlistApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [FilterApi.reducerPath]: FilterApi.reducer,
});

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      productApi.middleware,
      wishlistApi.middleware,
      cartApi.middleware,
      FilterApi.middleware
    ),
});

// Persistor for the store
export const persistor = persistStore(store);

// TypeScript types for store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
