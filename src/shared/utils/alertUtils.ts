import Swal from "sweetalert2";
import type { SweetAlertIcon } from "sweetalert2";

interface AlertOptions {
  html: string;
  icon?: SweetAlertIcon;
  title?: string;
  confirmButtonText?: string;
  confirmButtonColor?: string;
  allowOutsideClick?: boolean;
  allowEscapeKey?: boolean;
  timer?: number;
  timerProgressBar?: boolean;
}

interface ConfirmOptions {
  html: string;
  icon?: SweetAlertIcon;
  title?: string;
  confirmButtonText?: string;
  confirmButtonColor?: string;
  denyButtonText?: string;
  allowOutsideClick?: boolean;
  allowEscapeKey?: boolean;
}

/**
 * 성공 알림
 */
export const showSuccess = async (message: string, options?: Partial<AlertOptions>): Promise<void> => {
  const defaultOptions: AlertOptions = {
    html: message,
    icon: "success",
    confirmButtonText: "확인",
    confirmButtonColor: "#28a745",
    allowOutsideClick: false,
    allowEscapeKey: false,
  };

  await Swal.fire({ ...defaultOptions, ...options });
};

/**
 * 에러 알림
 */
export const showError = async (message: string, options?: Partial<AlertOptions>): Promise<void> => {
  const defaultOptions: AlertOptions = {
    html: message,
    icon: "error",
    confirmButtonText: "확인",
    confirmButtonColor: "#dc3545",
    allowOutsideClick: false,
    allowEscapeKey: false,
  };

  await Swal.fire({ ...defaultOptions, ...options });
};

/**
 * 정보 알림
 */
export const showInfo = async (message: string, options?: Partial<AlertOptions>): Promise<void> => {
  const defaultOptions: AlertOptions = {
    html: message,
    icon: "info",
    confirmButtonText: "확인",
    confirmButtonColor: "#17a2b8",
    allowOutsideClick: false,
    allowEscapeKey: false,
  };

  await Swal.fire({ ...defaultOptions, ...options });
};

/**
 * 경고 알림
 */
export const showWarning = async (message: string, options?: Partial<AlertOptions>): Promise<void> => {
  const defaultOptions: AlertOptions = {
    html: message,
    icon: "warning",
    confirmButtonText: "확인",
    confirmButtonColor: "#ffc107",
    allowOutsideClick: false,
    allowEscapeKey: false,
  };

  await Swal.fire({ ...defaultOptions, ...options });
};

/**
 * 자동 사라지는 성공 알림 (토스트 스타일)
 */
export const showSuccessToast = async (message: string, timer: number = 3000): Promise<void> => {
  await Swal.fire({
    html: message,
    icon: "success",
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
  });
};

/**
 * 자동 사라지는 에러 알림 (토스트 스타일)
 */
export const showErrorToast = async (message: string, timer: number = 4000): Promise<void> => {
  await Swal.fire({
    html: message,
    icon: "error",
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
  });
};

/**
 * 확인/취소 다이얼로그
 */
export const showConfirm = async (
  options: ConfirmOptions,
  onConfirm: () => void | Promise<void>
): Promise<void> => {
  const {
    html,
    icon = "info",
    title,
    confirmButtonText = "확인",
    confirmButtonColor = "#3085d6",
    denyButtonText = "취소",
    allowOutsideClick = false,
    allowEscapeKey = false,
  } = options;

  const result = await Swal.fire({
    html,
    icon,
    title,
    confirmButtonText,
    confirmButtonColor,
    showDenyButton: true,
    denyButtonText,
    allowOutsideClick,
    allowEscapeKey,
  });

  if (result.isConfirmed) {
    await onConfirm();
  }
};

/**
 * 삭제 전용 확인 다이얼로그
 */
export const showDeleteConfirm = async (
  count: number,
  itemName: string = "행",
  onConfirm: () => void | Promise<void>
): Promise<void> => {
  await showConfirm(
    {
      html: `선택한 ${count}개의 ${itemName}을(를) 삭제 하겠습니까?`,
      icon: "warning",
      title: "삭제 확인",
      confirmButtonText: "삭제",
      confirmButtonColor: "#dc3545",
    },
    onConfirm
  );
};

/**
 * API 응답에서 자동으로 알림 표시
 */
export const showApiResponse = async (response: any): Promise<void> => {
  if (response?.data?.message) {
    const message = response.data.message;
    const isSuccess = response.data.success !== false;
    
    if (isSuccess) {
      await showSuccess(message);
    } else {
      await showError(message);
    }
  }
};

/**
 * API 에러에서 자동으로 알림 표시
 */
export const showApiError = async (error: any, context: string = "API 호출"): Promise<void> => {
  console.error(`[${context}]`, error);
  
  let message = "알 수 없는 오류가 발생했습니다.";
  
  if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.message) {
    message = error.message;
  }
  
  await showError(message);
};
