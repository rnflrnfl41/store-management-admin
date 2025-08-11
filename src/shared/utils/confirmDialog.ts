import Swal from "sweetalert2";
import type { SweetAlertIcon } from "sweetalert2";

interface ConfirmOptions {
  html: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
  confirmButtonColor?: string;
  denyButtonText?: string;
  allowOutsideClick?: boolean;
  allowEscapeKey?: boolean;
}

/**
 * 공통 확인 다이얼로그
 * @param options - 다이얼로그 설정 옵션
 * @param onConfirm - 확인 버튼 클릭 시 실행할 함수
 */
export const showConfirm = async (
  options: ConfirmOptions,
  onConfirm: () => void | Promise<void>
): Promise<void> => {
  const {
    html,
    icon = "info",
    confirmButtonText = "확인",
    confirmButtonColor = "#3085d6",
    denyButtonText = "취소",
    allowOutsideClick = false,
    allowEscapeKey = false,
  } = options;

  const result = await Swal.fire({
    html,
    icon,
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
      confirmButtonText: "삭제",
      confirmButtonColor: "#d33",
    },
    onConfirm
  );
};
