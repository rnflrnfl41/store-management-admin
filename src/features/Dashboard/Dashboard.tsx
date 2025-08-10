const Dashboard = () => {
  return (
    <div>
      <h1>대시보드</h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '15px', 
        marginTop: '20px' 
      }}>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>총 매장 수</h3>
          <p style={{ fontSize: '2rem', margin: '10px 0', color: '#3498db', fontWeight: 'bold' }}>0</p>
        </div>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>총 사용자 수</h3>
          <p style={{ fontSize: '2rem', margin: '10px 0', color: '#2ecc71', fontWeight: 'bold' }}>0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;