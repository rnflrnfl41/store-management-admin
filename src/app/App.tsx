import { Provider, useSelector } from 'react-redux'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import { useAppInitialization } from '@utils/useAppInitialization';
import GlobalSpinner from '@components/GlobalSpinner';
import Login from '@features/Auth/Login';
import store from '@store/store';
import GlobalAlert from '@components/GlobalAlert';
import { selectUserInfo } from '@store/userSlice';

function Layout() {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      {/* <SideBarLayout /> */}
      <div style={{ width: '85%', height: '100vh' }}>
        {/* <Header onClickCompanySelect={() => getCompanyList()} /> */}
        <div style={{ padding: '20px' }}>
          <h1>메인 페이지</h1>
          <p>로그인 성공 후 보이는 페이지입니다.</p>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const userInfo = useSelector(selectUserInfo);
  const isAuthenticated = !!userInfo;


  useAppInitialization(); // 앱 시작 시 자동으로 인증 상태 확인

  //route에 있는 url 외에 다른 url로 접근 시 /login 으로 redirect
  //하지만 사용자 정보가 있을시에는 /dashboard로 redirect
  return (
    <>
      <GlobalSpinner />
      <GlobalAlert />
      <Routes>
        <Route 
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />
        <Route path="/dashboard" element={<Layout />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  )
}

export default App
