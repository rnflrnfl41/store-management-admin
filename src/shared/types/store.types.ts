import type { UserInfo } from './auth.types';

export interface LoadingState {
  isLoading: boolean;
}

export interface MessageState {
  message: string;
  type: 'info' | 'error' | 'success';
}

// Store 전체 타입 (RootState) - 실제 store 구조에 맞게 수정
export interface RootState {
  user: UserState;
  loading: boolean; // loadingSlice는 boolean을 반환
  message: MessageState;
  // 다른 slice들...
}

export interface UserState {
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
}