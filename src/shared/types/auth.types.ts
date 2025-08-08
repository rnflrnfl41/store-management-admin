export interface UserInfo {
  userId: number;
  loginId: string;
  storeId: number;
  userName: string;
  token: string;
}

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  loginId: string;
  storeId: number;
  userName: string;
  token: string;
}