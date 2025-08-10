import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { publicAxiosInstance } from "./axiosInstance";
import { loginSuccess, loginFailure } from "@store/userSlice";
import type { UserInfo } from "@types";

// 서버에서 현재 사용자 정보를 가져오는 함수
const getCurrentUserFromServer = async (): Promise<UserInfo | null> => {
  try {
    const { data } = await publicAxiosInstance.post("/auth/refresh-token");

    return data ?? null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Redux 상태 갱신 함수 (공통)
const handleUserAuthState = (
  userInfo: UserInfo | null,
  dispatchFn: (action: any) => void
) => {
  if (userInfo) {
    dispatchFn(loginSuccess(userInfo));
  } else {
    dispatchFn(loginFailure());
  }
};

// 앱 초기화 훅
export const useAppInitialization = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const userInfo = await getCurrentUserFromServer();
      handleUserAuthState(userInfo, dispatch);
    })();
  }, [dispatch]);
};

// 훅 외부에서 직접 호출용 함수
export const initializeApp = async (): Promise<UserInfo | null> => {
  const userInfo = await getCurrentUserFromServer();

  const { default: store } = await import("@store/store");
  handleUserAuthState(userInfo, store.dispatch);

  return userInfo;
};
