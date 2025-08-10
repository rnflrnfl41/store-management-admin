import { Provider, useSelector } from 'react-redux'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import { useAppInitialization } from '@utils/useAppInitialization';
import GlobalSpinner from '@components/GlobalSpinner';
import Login from '@features/Auth/Login';
import store from '@store/store';
import GlobalAlert from '@components/GlobalAlert';
import { selectUserInfo } from '@store/userSlice';
import MainLayout from '@components/Layout/MainLayout';
import Dashboard from '@features/Dashboard/Dashboard';
import StoreList from '@features/Store/StoreList';
import UserList from '@features/User/UserList';

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
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="stores" element={<StoreList />} />
          <Route path="users" element={<UserList />} />
        </Route>
        <Route index element={<Navigate to="/login" replace />} />
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
