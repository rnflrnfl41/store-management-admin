import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { axiosInstance } from '@utils/axiosInstance';
import { selectUserInfo } from '@store/userSlice';
import { showConfirm, showSuccess } from '@utils/alertUtils';
import UserModal from './UserModal';
import styles from '@css/UserList.module.css';
import type { Store, User, StoreWithUsers, ModalMode } from '@types';

const UserList = () => {
  const userInfo = useSelector(selectUserInfo);
  const [storesWithUsers, setStoresWithUsers] = useState<StoreWithUsers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<number>();
  const [modalMode, setModalMode] = useState<ModalMode>('create');

  const fetchStoresWithUsers = async () => {
    try {
      setIsLoading(true);
      // 먼저 모든 매장을 가져옴
      const storesResponse = await axiosInstance.get('/store/all');
      console.log(storesResponse.data);
      const stores: Store[] = storesResponse.data;

      // 각 매장별로 사용자 목록을 가져옴
      const storesWithUsersData = await Promise.all(
        stores.map(async (store) => {
          try {
            const usersResponse = await axiosInstance.get(`/user/${store.id}`);
            return {
              store,
              users: usersResponse.data || []
            };
          } catch (error) {
            console.error(error);
            return {
              store,
              users: []
            };
          }
        })
      );

      setStoresWithUsers(storesWithUsersData);
    } catch (error) {
      console.error('매장 목록 불러오기 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.accessToken) {
      fetchStoresWithUsers();
    } else {
      setIsLoading(false);
    }
  }, [userInfo]);

  const handleOpenCreateModal = (storeId: number) => {
    setSelectedUser(null);
    setSelectedStoreId(storeId);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User, storeId: number) => {
    setSelectedUser(user);
    setSelectedStoreId(storeId);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setSelectedStoreId(0);
  };

  const handleUserSuccess = () => {
    fetchStoresWithUsers();
  };

  const handleDeleteUser = async (userId: string, userName: string) => {

    await showConfirm(
          {
            html: `"${userName}" 사용자를 삭제하시겠습니까?`,
            icon: 'info'
          },
          async () => {
            try {
              const response = await axiosInstance.delete(`/user/${userId}`);
    
              await showSuccess(response.data);
    
              fetchStoresWithUsers();
    
            } catch (error) {
              console.log(error);
            }
          }
        );

  };

  if (isLoading) {
    return (
      <div>
        <div className={styles.user_header}>
          <div className={styles.user_title_section}>
            <h1>사용자 관리</h1>
            <p>사용자 계정을 관리하고 권한을 설정하세요</p>
          </div>
        </div>
        <div className={styles.loading}>사용자 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.user_header}>
        <div className={styles.user_title_section}>
          <h1>사용자 관리</h1>
          <p>사용자 계정을 관리하고 권한을 설정하세요</p>
        </div>
      </div>
      
      {storesWithUsers.length === 0 ? (
        <div className={styles.user_content}>
          <div className={styles.user_empty_icon}>👥</div>
          <h3 className={styles.user_empty_title}>매장이 없습니다</h3>
          <p className={styles.user_empty_description}>먼저 매장을 추가해주세요!</p>
        </div>
      ) : (
        storesWithUsers.map(({ store, users }) => (
          <div key={store.id} className={styles.store_section}>
            <div className={styles.store_header}>
              <div className={styles.store_title}>
                <span className={styles.store_icon}>🏪</span>
                <span>{store.name}</span>
                <span className={styles.store_count}>({users.length}명)</span>
              </div>
              <button 
                className={styles.store_add_btn}
                onClick={() => handleOpenCreateModal(store.id)}
              >
                + 사용자 추가
              </button>
            </div>
            
            <div className={styles.store_content}>
              {users.length === 0 ? (
                <div className={styles.user_content}>
                  <div className={styles.user_empty_icon}>👤</div>
                  <h3 className={styles.user_empty_title}>사용자가 없습니다</h3>
                  <p className={styles.user_empty_description}>이 매장의 첫 번째 사용자를 추가해보세요!</p>
                  <button 
                    className={styles.user_empty_btn} 
                    onClick={() => handleOpenCreateModal(store.id)}
                  >
                    사용자 추가하기
                  </button>
                </div>
              ) : (
                <div className={styles.user_list}>
                  {users.map((user) => (
                    <div 
                      key={user.id} 
                      className={styles.user_card} 
                      onClick={() => handleOpenEditModal(user, store.id)}
                    >
                      <div className={styles.user_card_header}>
                        <h3 className={styles.user_name}>{user.name}</h3>
                        <button 
                          className={styles.user_delete_btn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUser(user.id, user.name);
                          }}
                        >
                          ×
                        </button>
                      </div>
                      <div className={styles.user_info}>
                        <div className={styles.user_info_item}>
                          <span className={styles.user_info_icon}>🆔</span>
                          <span className={styles.user_info_text}>{user.loginId}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      )}

      <UserModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleUserSuccess}
        user={selectedUser}
        mode={modalMode}
        storeId={selectedStoreId || 0}
      />
    </div>
  );
};

export default UserList;