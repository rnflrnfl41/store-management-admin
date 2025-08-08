import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserInfo } from '../shared/types/auth.types';

interface UserState {
    userInfo: UserInfo | null;
}

const initialState: UserState = {
    userInfo: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload;
        },
        loginFailure: (state) => {
            state.userInfo = null;
        },
        logout: (state) => {
            state.userInfo = null;
        },
        updateAccessToken: (state, action: PayloadAction<string>) => {
            if (state.userInfo) {
                state.userInfo.accessToken = action.payload;
            }
        },
        updateUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
            if (state.userInfo) {
                state.userInfo = { ...state.userInfo, ...action.payload };
            }
        },
    },
});

export const { loginSuccess, loginFailure, logout, updateAccessToken, updateUserInfo } = userSlice.actions;

// Selectors
export const selectUserInfo = (state: { user: UserState }) => state.user.userInfo;

export default userSlice.reducer;
