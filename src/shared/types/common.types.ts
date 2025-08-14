import type { UserInfo } from './auth.types';

export interface LoadingState {
  isLoading: boolean;
}

export interface UserState {
  userInfo: UserInfo | null;
}

// Store 전체 타입 (RootState) - 실제 store 구조에 맞게 수정
export interface RootState {
  user: UserState;
  loading: LoadingState;
}