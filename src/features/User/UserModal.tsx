import { useState, useEffect } from 'react';

import { axiosInstance } from '@utils/axiosInstance';
import { showSuccess } from '@utils/alertUtils';
import styles from '@css/UserModal.module.css';
import type { User, ModalMode } from '@types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  user?: User | null;
  mode?: ModalMode;
  storeId: number;
}

interface UserFormData {
  loginId: string;
  password: string;
  name: string;
  storeId: number;
}

interface FormErrors {
  loginId?: string;
  password?: string;
  name?: string;
}

const UserModal = ({ isOpen, onClose, onSuccess, user, mode = 'create', storeId }: UserModalProps) => {

  
  const [formData, setFormData] = useState<UserFormData>({
    loginId: '',
    password: '',
    name: '',
    storeId: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        loginId: user.loginId,
        password: '',
        name: user.name,
        storeId: storeId
      });
    } else {
      setFormData({ loginId: '', password: '', name: '', storeId: storeId });
    }
  }, [user, mode, storeId]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.loginId.trim()) {
      newErrors.loginId = '로그인 아이디를 입력해주세요.';
    }

    if (!formData.password.trim() && mode === 'create') {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let response;
      const submitData = { ...formData };
      
      // 수정 모드에서 비밀번호가 비어있으면 제거
      if (mode === 'edit' && !submitData.password.trim()) {
        delete (submitData as any).password;
      }

      if (mode === 'edit' && user) {
        response = await axiosInstance.patch(`/user/${user.id}`, submitData);
      } else {
        response = await axiosInstance.post('/user', submitData);
      }

      await showSuccess(response.data);

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
    
  };

  const handleClose = () => {
    setFormData({ loginId: '', password: '', name: '', storeId: 0 });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal_overlay} onClick={handleClose}>
      <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal_header}>
          <h2 className={styles.modal_title}>{mode === 'edit' ? '사용자 수정' : '사용자 추가'}</h2>
          <p className={styles.modal_subtitle}>{mode === 'edit' ? '사용자 정보를 수정해주세요' : '새로운 사용자 정보를 입력해주세요'}</p>
        </div>

        <div className={styles.form_group}>
          <label className={`${styles.form_label} ${styles.required}`}>로그인 아이디</label>
          <input
            type="text"
            className={`${styles.form_input} ${errors.loginId ? styles.error : ''}`}
            value={formData.loginId}
            onChange={(e) => handleInputChange('loginId', e.target.value)}
            placeholder="로그인 아이디를 입력하세요"
          />
          {errors.loginId && <div className={styles.error_message}>{errors.loginId}</div>}
        </div>

        <div className={styles.form_group}>
          <label className={`${styles.form_label} ${mode === 'create' ? styles.required : ''}`}>
            비밀번호 {mode === 'edit' && '(변경시에만 입력)'}
          </label>
          <input
            type="password"
            className={`${styles.form_input} ${errors.password ? styles.error : ''}`}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder={mode === 'edit' ? '변경할 비밀번호를 입력하세요' : '비밀번호를 입력하세요'}
          />
          {errors.password && <div className={styles.error_message}>{errors.password}</div>}
        </div>

        <div className={styles.form_group}>
          <label className={`${styles.form_label} ${styles.required}`}>이름</label>
          <input
            type="text"
            className={`${styles.form_input} ${errors.name ? styles.error : ''}`}
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="이름을 입력하세요"
          />
          {errors.name && <div className={styles.error_message}>{errors.name}</div>}
        </div>

        <div className={styles.modal_actions}>
          <button 
            className={`${styles.modal_btn} ${styles.modal_btn_cancel}`}
            onClick={handleClose}
            disabled={isLoading}
          >
            취소
          </button>
          <button 
            className={`${styles.modal_btn} ${styles.modal_btn_save}`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;