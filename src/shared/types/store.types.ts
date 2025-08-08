import type { UserInfo } from './auth.types';

export interface LoadingState {
  isLoading: boolean;
}

export interface MessageState {
  message: string | null;
  type: 'success' | 'error' | 'warning' | 'info';
}

// Store 전체 타입 (RootState)
export interface RootState {
  user: UserState;
  loading: LoadingState;
  message: MessageState;
  // 다른 slice들...
}

export interface UserState {
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}