const UserList = () => {
  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h1 style={{ margin: 0 }}>사용자 관리</h1>
        <button style={{ 
          background: '#2ecc71', 
          color: 'white', 
          border: 'none', 
          padding: '10px 20px', 
          borderRadius: '4px', 
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          사용자 추가
        </button>
      </div>
      <div style={{ 
        background: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        padding: '20px' 
      }}>
        <p>사용자 목록이 여기에 표시됩니다.</p>
      </div>
    </div>
  );
};

export default UserList;