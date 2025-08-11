import '@css/UserList.css';

const UserList = () => {
  return (
    <div>
      <div className="user-header">
        <div className="user-title-section">
          <h1>사용자 관리</h1>
          <p>사용자 계정을 관리하고 권한을 설정하세요</p>
        </div>
        <button className="user-add-btn">
          + 사용자 추가
        </button>
      </div>
      
      <div className="user-content">
        <div className="user-empty-icon">👥</div>
        <h3 className="user-empty-title">사용자가 없습니다</h3>
        <p className="user-empty-description">첫 번째 사용자를 추가해보세요!</p>
        <button className="user-empty-btn">
          사용자 추가하기
        </button>
      </div>
    </div>
  );
};

export default UserList;