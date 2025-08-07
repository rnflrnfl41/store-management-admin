import { createSlice } from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type { UserInfo, UserState } from '@types';

// 초기 상태 (localStorage 사용 안함)
const initialState: UserState = {
  userInfo: null,
  isAuthenticated: false,
  isLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 로그인 성공
    loginSuccess: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      // localStorage 저장 제거 - 보안상 메모리에만 저장
    },
    
    // 로그인 시작 (로딩 상태)
    loginStart: (state) => {
      state.isLoading = true;
    },
    
    // 로그인 실패
    loginFailure: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    
    // 로그아웃
    logout: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    
    // 토큰 업데이트 (refresh token으로 새 access token 받았을 때)
    updateToken: (state, action: PayloadAction<string>) => {
      if (state.userInfo) {
        state.userInfo.token = action.payload;
      }
    },
    
    // 사용자 정보 업데이트 (토큰 제외한 다른 정보들)
    updateUserInfo: (state, action: PayloadAction<Partial<Omit<UserInfo, 'token'>>>) => {
      if (state.userInfo) {
        state.userInfo = { ...state.userInfo, ...action.payload };
      }
    },
  },
});

export const {
  loginSuccess,
  loginStart,
  loginFailure,
  logout,
  updateToken,
  updateUserInfo,
} = userSlice.actions;

// Selectors
export const selectUser = (state: { user: UserState }) => state.user.userInfo;
export const selectIsAuthenticated = (state: { user: UserState }) => state.user.isAuthenticated;
export const selectIsLoading = (state: { user: UserState }) => state.user.isLoading;
export const selectUserId = (state: { user: UserState }) => state.user.userInfo?.userId;
export const selectStoreId = (state: { user: UserState }) => state.user.userInfo?.storeId;
export const selectUserName = (state: { user: UserState }) => state.user.userInfo?.userName;
export const selectToken = (state: { user: UserState }) => state.user.userInfo?.token;

export default userSlice.reducer;