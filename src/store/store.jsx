import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import userReducer from "./userSlice/userSlice";
import menuReducer from "./menuSlice/menuSlice";
import sidebarReducer from "./sidebarSlice/sidebarSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "menu", "sidebar"],
};

const rootReducer = combineReducers({
  user: userReducer,
  menu: menuReducer,
  sidebar: sidebarReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
