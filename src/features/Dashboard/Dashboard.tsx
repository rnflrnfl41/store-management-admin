import '@css/Dashboard.css';

const Dashboard = () => {
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
          <p className="stat-number">0</p>
          <div className="stat-description">전체 매장</div>
        </div>
        
        <div className="stat-card secondary">
          <div className="stat-icon">👥</div>
          <h3 className="stat-title">총 사용자 수</h3>
          <p className="stat-number">0</p>
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