import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { axiosInstance } from '@utils/axiosInstance';
import { selectUserInfo } from '@store/userSlice';
import StoreModal from './StoreModal';
import styles from '@css/StoreList.module.css';
import { showConfirm } from '@utils/confirmDialog';
import { useDispatch } from 'react-redux';
import { setMessage } from '@store/messageSlice';

interface Store {
  publicId: string;
  name: string;
  ownerName: string;
  phone: string;
}

const StoreList = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  //모든 store 정보 불러오기
  const fetchStores = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/store/all');
      setStores(response.data);
    } catch (error) {
      console.info(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 사용자 정보가 있을 때만 매장 목록을 불러옴
    if (userInfo?.accessToken) {
      fetchStores();
    } else {
      setIsLoading(false);
    }
  }, [userInfo]);

  //매장 생성 모달 열기
  const handleOpenCreateModal = () => {
    setSelectedStore(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  //매장 수정 모달 열기
  const handleOpenEditModal = (store: Store) => {
    setSelectedStore(store);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  //모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStore(null);
  };

  //모달에서 매장 생성이나 수정 후 매장 목록 불러오기
  const handleStoreSuccess = () => {
    fetchStores();
  };

  //매장 삭제 
  const handleDeleteStore = async (storeId: string, storeName: string) => {

    await showConfirm(
      {
        html: `"${storeName}" 매장을 삭제하시겠습니까?`,
        icon: 'info'
      },
      async () => {
        try {
          const response = await axiosInstance.delete(`/store/${storeId}`);

          dispatch(
            setMessage({
              message: response.data,
              type: 'success',
            })
          );

          fetchStores();

        } catch (error) {
          console.log(error);
        }
      }
    );

  };

  if (isLoading) {
    return (
      <div>
        <div className={styles.store_header}>
          <div className={styles.store_title_section}>
            <h1>매장 관리</h1>
            <p>매장 정보를 관리하고 수정하세요</p>
          </div>
        </div>
        <div className={styles.loading}>매장 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.store_header}>
        <div className={styles.store_title_section}>
          <h1>매장 관리</h1>
          <p>매장 정보를 관리하고 수정하세요</p>
        </div>
        <button className={styles.store_add_btn} onClick={handleOpenCreateModal}>
          + 매장 추가
        </button>
      </div>

      {stores.length === 0 ? (
        <div className={styles.store_content}>
          <div className={styles.store_empty_icon}>🏪</div>
          <h3 className={styles.store_empty_title}>매장이 없습니다</h3>
          <p className={styles.store_empty_description}>첫 번째 매장을 추가해보세요!</p>
          <button className={styles.store_empty_btn} onClick={handleOpenCreateModal}>
            매장 추가하기
          </button>
        </div>
      ) : (
        <div className={styles.store_list}>
          {stores.map((store) => (
            <div key={store.publicId} className={styles.store_card} onClick={() => handleOpenEditModal(store)}>
              <div className={styles.store_card_header}>
                <h3 className={styles.store_name}>{store.name}</h3>
                <button
                  className={styles.store_delete_btn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteStore(store.publicId, store.name);
                  }}
                >
                  ×
                </button>
              </div>
              <div className={styles.store_info}>
                <div className={styles.store_info_item}>
                  <span className={styles.store_info_icon}>👤</span>
                  <span className={styles.store_info_text}>{store.ownerName}</span>
                </div>
                {store.phone && (
                  <div className={styles.store_info_item}>
                    <span className={styles.store_info_icon}>📞</span>
                    <span className={styles.store_info_text}>{store.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <StoreModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleStoreSuccess}
        store={selectedStore}
        mode={modalMode}
      />
    </div>
  );
};

export default StoreList;