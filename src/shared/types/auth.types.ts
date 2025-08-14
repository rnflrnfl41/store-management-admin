export interface UserInfo {
  userId: number;
  loginId: string;
  storeId: number;
  userName: string;
  accessToken: string;
}

export interface LoginRequest {
  loginId: string;
  password: string;
  adminLogin: boolean;
}