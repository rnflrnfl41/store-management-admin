import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { publicAxiosInstance } from './axiosInstance';
import { loginSuccess, loginFailure } from '@store/userSlice';
import type { UserInfo } from '@types';

// 서버에서 현재 사용자 정보를 가져오는 함수
const getCurrentUserFromServer = async (): Promise<UserInfo | null> => {
  try {
    // 인증 불필요 API용 인스턴스 사용 (쿠키 기반 인증)
    const response = await publicAxiosInstance.get('/auth/me');
    
    if (response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.log('사용자 정보 없음 또는 에러:', error);
    return null;
  }
};

// 앱 초기화 훅
export const useAppInitialization = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 서버에서 현재 사용자 정보 확인
        const userInfo = await getCurrentUserFromServer();

        if (userInfo) {
          // 인증된 사용자라면 Redux에 저장
          dispatch(loginSuccess(userInfo));
        } else {
          // 인증되지 않은 사용자
          dispatch(loginFailure());
        }
      } catch (error) {
        console.error("앱 초기화 실패:", error);
        dispatch(loginFailure());
      }
    };

    initializeAuth();
  }, [dispatch]);
};

// 직접 호출용 함수 (훅 외부에서 사용할 때)
export const initializeApp = async () => {
  try {
    const userInfo = await getCurrentUserFromServer();
    
    if (userInfo) {
      // store 직접 사용 (훅 외부에서)
      const { default: store } = await import('@store/store');
      const { loginSuccess, loginFailure } = await import('@store/userSlice');
      
      store.dispatch(loginSuccess(userInfo));
      return userInfo;
    } else {
      const { default: store } = await import('@store/store');
      const { loginFailure } = await import('@store/userSlice');
      store.dispatch(loginFailure());
      return null;
    }
  } catch (error) {
    console.error("앱 초기화 실패:", error);
    const { default: store } = await import('@store/store');
    const { loginFailure } = await import('@store/userSlice');
    store.dispatch(loginFailure());
    return null;
  }
};
