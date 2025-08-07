import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import Swal from "sweetalert2";
import store from "@store/store";
import { setMessage } from "@store/messageSlice";
import { startLoading, stopLoading } from "@store/loadingSlice";
import { logout, updateToken, selectToken } from '@store/userSlice';
import { ApiErrorResponse } from '@types';

// refresh token 요청 중인지 확인하는 플래그
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

// 큐에 쌓인 요청들을 처리하는 함수
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });

  failedQueue = [];
};

// refresh token으로 새 access token 요청
const refreshAccessToken = async (): Promise<string> => {
  try {
    const response = await axios.post(
      "/auth/refresh",
      {},
      {
        baseURL: "http://localhost:8080",
        withCredentials: true, // refresh token이 쿠키에 있으므로
      }
    );

    const newToken = response.data.token;

    // Redux에만 새 토큰 저장 (localStorage 사용 안함)
    store.dispatch(updateToken(newToken));

    return newToken;
  } catch (error) {
    // refresh token도 만료된 경우
    store.dispatch(logout());
    throw error;
  }
};

// 사용자 정보 정리 함수
const clearUserInfo = async () => {
  store.dispatch(logout());

  await Swal.fire({
    html: "세션이 만료되었습니다. 다시 로그인해주세요.",
    icon: "warning",
    confirmButtonText: "확인",
    confirmButtonColor: "#3085d6",
    allowOutsideClick: false,
    allowEscapeKey: false,
  });

  // 로그인 페이지로 리다이렉트
  window.location.href = "/login";
};

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000, // 10초 타임아웃 추가
  withCredentials: true,
});

// 요청 인터셉터 설정 (토큰 추가)
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    store.dispatch(startLoading());

    const state = store.getState();
    const token = selectToken(state);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    store.dispatch(stopLoading());
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    store.dispatch(stopLoading());
    return response;
  },

  async (error: AxiosError<ApiErrorResponse>) => {
    store.dispatch(stopLoading());

    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 refresh 중인 경우 큐에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);

        // 원래 요청에 새 토큰 적용하여 재시도
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await clearUserInfo();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 403 에러 또는 refresh token도 만료된 경우
    if (status === 403) {
      await clearUserInfo();
      return Promise.reject(error);
    }

    // 기타 에러 처리
    if (status && status >= 500) {
      store.dispatch(
        setMessage({
          message: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
          type: "error",
        })
      );
    } else {
      const message =
        error.response?.data?.message ||
        error.message ||
        "알 수 없는 오류가 발생했습니다.";

      store.dispatch(
        setMessage({
          message,
          type: "error",
        })
      );
    }

    return Promise.reject(error);
  }
);

// originalRequest에 _retry 프로퍼티 추가를 위한 타입 확장
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

export default axiosInstance;
