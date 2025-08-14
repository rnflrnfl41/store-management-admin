import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { axiosInstance } from '@utils/axiosInstance';
import { selectUserInfo } from '@store/userSlice';
import '@css/Dashboard.css';

const Dashboard = () => {
  const userInfo = useSelector(selectUserInfo);
  const [storeCount, setStoreCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCounts = async () => {
    try {
      setIsLoading(true);
      const [storesResponse, usersResponse] = await Promise.all([
        axiosInstance.get('/store/count/total'),
        axiosInstance.get('/user/count/total')
      ]);
      
      setStoreCount(storesResponse.data || 0);
      setUserCount(usersResponse.data || 0);
    } catch (error) {
      console.error('대시보드 데이터 불러오기 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.accessToken) {
      fetchCounts();
    } else {
      setIsLoading(false);
    }
  }, [userInfo]);

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">대시보드</h1>
        <p className="dashboard-subtitle">전체 현황을 한눈에 확인하세요</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <h3 className="stat-title">총 매장 수</h3>
          <p className="stat-number">{isLoading ? '...' : storeCount}</p>
          <div className="stat-description">전체 매장</div>
        </div>
        
        <div className="stat-card secondary">
          <div className="stat-icon">👥</div>
          <h3 className="stat-title">총 사용자 수</h3>
          <p className="stat-number">{isLoading ? '...' : userCount}</p>
          <div className="stat-description">등록된 사용자</div>
        </div>
      </div>
      
      <div className="dashboard-activity">
        <h2 className="activity-title">최근 활동</h2>
        <p className="activity-content">최근 활동 내역이 여기에 표시됩니다.</p>
      </div>
    </div>
  );
};

export default Dashboard;