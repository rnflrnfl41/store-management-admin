import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import Swal from "sweetalert2";
import store from "@store/store";
import { setMessage } from "@store/messageSlice";
import { startLoading, stopLoading } from "@store/loadingSlice";
import { logout, updateAccessToken } from '@store/userSlice';
import type { ApiErrorResponse } from '@types';

// refresh token 요청 중인지 확인하는 플래그
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const baseUrl = 'http://localhost:8080/api';

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
        baseURL: baseUrl,
        withCredentials: true, // refresh token이 쿠키에 있으므로
      }
    );

    const newToken = response.data.accessToken;

    // Redux에만 새 토큰 저장 (localStorage 사용 안함)
    store.dispatch(updateAccessToken(newToken));

    return newToken;
  } catch (error: any) {
    // 서버에서 보낸 에러 메시지가 있는 경우 우선 처리
    const errorData = error.response?.data;
    if (errorData?.message) {
      store.dispatch(
        setMessage({
          message: errorData.message,
          type: "error",
        })
      );
    } else {
      // 서버에서 메시지를 보내지 않은 예외적인 경우만 클라이언트에서 처리
      const status = error.response?.status;
      
      switch (status) {
        case 500:
        case 502:
        case 503:
          // 서버 오류
          store.dispatch(
            setMessage({
              message: "서버 오류로 인해 토큰 갱신에 실패했습니다. 잠시 후 다시 시도해주세요.",
              type: "error",
            })
          );
          break;
        default:
          // 네트워크 오류
          if (!error.response) {
            store.dispatch(
              setMessage({
                message: "네트워크 연결을 확인해주세요.",
                type: "error",
              })
            );
          }
      }
    }

    // 모든 refresh token 실패 시 로그아웃 처리
    store.dispatch(logout());
    throw error;
  }
};

// 사용자 정보 정리 함수
const clearUserInfo = async (reason: string = "세션이 만료되었습니다. 다시 로그인해주세요.") => {
  store.dispatch(logout());

  await Swal.fire({
    html: reason,
    icon: "warning",
    confirmButtonText: "확인",
    confirmButtonColor: "#3085d6",
    allowOutsideClick: false,
    allowEscapeKey: false,
  });

  // 로그인 페이지로 리다이렉트
  window.location.href = "/login";
};

// 서버 응답에서 메시지 처리 함수
const handleServerMessage = (response: AxiosResponse) => {
  const data = response.data;
  
  // 서버에서 성공 메시지를 보낸 경우
  if (data.message && data.success) {
    store.dispatch(
      setMessage({
        message: data.message,
        type: "success",
      })
    );
  }
};

// 서버 에러 메시지 처리 함수
const handleServerError = (error: AxiosError<ApiErrorResponse>) => {
  const status = error.response?.status;
  const errorData = error.response?.data;

  // 서버에서 보낸 에러 메시지가 있는 경우
  if (errorData?.message) {
    store.dispatch(
      setMessage({
        message: errorData.message,
        type: "error",
      })
    );
    return;
  }

  // HTTP 상태 코드별 기본 메시지
  switch (status) {
    case 400:
      store.dispatch(
        setMessage({
          message: "잘못된 요청입니다. 입력값을 확인해주세요.",
          type: "error",
        })
      );
      break;
    case 401:
      store.dispatch(
        setMessage({
          message: "인증이 필요합니다. 다시 로그인해주세요.",
          type: "error",
        })
      );
      break;
    case 403:
      store.dispatch(
        setMessage({
          message: "접근 권한이 없습니다.",
          type: "error",
        })
      );
      break;
    case 404:
      store.dispatch(
        setMessage({
          message: "요청한 리소스를 찾을 수 없습니다.",
          type: "error",
        })
      );
      break;
    case 409:
      store.dispatch(
        setMessage({
          message: "이미 존재하는 데이터입니다.",
          type: "error",
        })
      );
      break;
    case 422:
      store.dispatch(
        setMessage({
          message: "입력값이 올바르지 않습니다.",
          type: "error",
        })
      );
      break;
    case 500:
      store.dispatch(
        setMessage({
          message: "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
          type: "error",
        })
      );
      break;
    case 502:
    case 503:
    case 504:
      store.dispatch(
        setMessage({
          message: "서버가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.",
          type: "error",
        })
      );
      break;
    default:
      // 네트워크 오류
      if (!error.response) {
        store.dispatch(
          setMessage({
            message: "네트워크 연결을 확인해주세요.",
            type: "error",
          })
        );
      } else {
        store.dispatch(
          setMessage({
            message: error.message || "알 수 없는 오류가 발생했습니다.",
            type: "error",
          })
        );
      }
  }
};

// 인증이 필요 없는 API용 인스턴스 (로그인, 회원가입 등)
export const publicAxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  withCredentials: true,
});

// 인증이 필요한 API용 인스턴스 (토큰 자동 추가)
export const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 10000, // 10초 타임아웃 추가
  withCredentials: true,
});

// public 인스턴스용 요청 인터셉터 (로딩만 관리)
publicAxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    store.dispatch(startLoading());
    return config;
  },
  (error: AxiosError) => {
    store.dispatch(stopLoading());
    return Promise.reject(error);
  }
);

// public 인스턴스용 응답 인터셉터 (성공/에러 메시지 처리)
publicAxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    store.dispatch(stopLoading());
    
    // 서버에서 성공 메시지를 보낸 경우 처리
    handleServerMessage(response);
    
    return {
      ...response,
      data: response.data.data
    };
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    store.dispatch(stopLoading());
    handleServerError(error);
    return Promise.reject(error);
  }
);

// 요청 인터셉터 설정 (토큰 추가)
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    store.dispatch(startLoading());

    const state = store.getState();
    const token = state.user.userInfo?.accessToken;

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
    
    // 서버에서 성공 메시지를 보낸 경우 처리
    handleServerMessage(response);
    
    return {
      ...response,
      data: response.data.data
    };
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

    // 서버 에러 메시지 처리
    handleServerError(error);

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
