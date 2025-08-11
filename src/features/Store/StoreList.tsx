import '@css/StoreList.css';

const StoreList = () => {
  return (
    <div>
      <div className="store-header">
        <div className="store-title-section">
          <h1>매장 관리</h1>
          <p>매장 정보를 관리하고 수정하세요</p>
        </div>
        <button className="store-add-btn">
          + 매장 추가
        </button>
      </div>
      
      <div className="store-content">
        <div className="store-empty-icon">🏪</div>
        <h3 className="store-empty-title">매장이 없습니다</h3>
        <p className="store-empty-description">첫 번째 매장을 추가해보세요!</p>
        <button className="store-empty-btn">
          매장 추가하기
        </button>
      </div>
    </div>
  );
};

export default StoreList;