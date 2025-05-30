import { configureStore } from "@reduxjs/toolkit";
import { api } from "@/api";
import {authSlice} from "@/store/slices/authSlice";

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(api.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store };