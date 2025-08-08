import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, loginFailure } from "@store/userSlice";
import type { UserInfo } from "@types";

// 서버에서 현재 사용자 정보를 가져오는 API
const getCurrentUserFromServer = async (): Promise<UserInfo | null> => {
  try {
    // refresh token이 쿠키에 있다면 서버에서 새 access token과 사용자 정보를 반환
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include", // 쿠키 포함
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("사용자 정보 조회 실패:", error);
    return null;
  }
};

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

// App.tsx에서 사용
// import { useAppInitialization } from '@/hooks/useAppInitialization';
//
// function App() {
//   useAppInitialization(); // 앱 시작 시 인증 상태 복구
//
//   return (
//     <div className="App">
//       {/* 앱 컴포넌트들 */}
//     </div>
//   );
// }
