

// Store 관련 타입
export interface Store {
  id: number;
  name: string;
  ownerName: string;
  phone: string;
}

// User 관련 타입
export interface User {
  id: string;
  loginId: string;
  password: string;
  name: string;
}

// Store와 User를 함께 관리하는 타입
export interface StoreWithUsers {
  store: Store;
  users: User[];
}

// 모달 모드 타입
export type ModalMode = 'create' | 'edit';