import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";
import {AuthState} from "@/types/auth";

const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
    userId: null,
    role: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ accessToken: string; refreshToken: string }>
        ) => {
            const { accessToken, refreshToken } = action.payload;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;

            const decode : any = jwtDecode(accessToken);
            const userId = decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
            const role = decode["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            state.userId = userId;
            state.role = role

            console.log("setCredentials:" + userId)

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("userId", userId);
            localStorage.setItem("role", role);
        },
        updateAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
            localStorage.setItem("accessToken", action.payload);
        },
        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.userId = null;
            state.role = null;

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userId");
            localStorage.removeItem("role");
        },
    },
});

export const { setCredentials, updateAccessToken, logout } = authSlice.actions;