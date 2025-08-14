import { useState, useEffect } from 'react';
import { axiosInstance } from '@utils/axiosInstance';
import styles from '@css/StoreModal.module.css';

import { showSuccess } from '@utils/alertUtils';
import type { Store, ModalMode } from '@types';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  store?: Store | null;
  mode?: ModalMode;
}

interface StoreFormData {
  name: string;
  ownerName: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  ownerName?: string;
}

const StoreModal = ({ isOpen, onClose, onSuccess, store, mode = 'create' }: StoreModalProps) => {
  

  
  const [formData, setFormData] = useState<StoreFormData>({
    name: '',
    ownerName: '',
    phone: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (store && mode === 'edit') {
      setFormData({
        name: store.name,
        ownerName: store.ownerName,
        phone: store.phone || ''
      });
    } else {
      setFormData({ name: '', ownerName: '', phone: '' });
    }
  }, [store, mode]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '매장명을 입력해주세요.';
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = '점주명을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof StoreFormData, value: string) => {
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

      if (mode === 'edit' && store) {
        response = await axiosInstance.patch(`/store/${store.publicId}`, formData);
      } else {
        response = await axiosInstance.post('/store', formData);
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
    setFormData({ name: '', ownerName: '', phone: '' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal_overlay} onClick={handleClose}>
      <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal_header}>
          <h2 className={styles.modal_title}>{mode === 'edit' ? '매장 수정' : '매장 추가'}</h2>
          <p className={styles.modal_subtitle}>{mode === 'edit' ? '매장 정보를 수정해주세요' : '새로운 매장 정보를 입력해주세요'}</p>
        </div>

        <div className={styles.form_group}>
          <label className={`${styles.form_label} ${styles.required}`}>매장명</label>
          <input
            type="text"
            className={`${styles.form_input} ${errors.name ? styles.error : ''}`}
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="매장명을 입력하세요"
          />
          {errors.name && <div className={styles.error_message}>{errors.name}</div>}
        </div>

        <div className={styles.form_group}>
          <label className={`${styles.form_label} ${styles.required}`}>점주명</label>
          <input
            type="text"
            className={`${styles.form_input} ${errors.ownerName ? styles.error : ''}`}
            value={formData.ownerName}
            onChange={(e) => handleInputChange('ownerName', e.target.value)}
            placeholder="점주명을 입력하세요"
          />
          {errors.ownerName && <div className={styles.error_message}>{errors.ownerName}</div>}
        </div>

        <div className={styles.form_group}>
          <label className={styles.form_label}>매장 번호</label>
          <input
            type="tel"
            className={styles.form_input}
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="매장 번호를 입력하세요 (선택사항)"
          />
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

export default StoreModal;