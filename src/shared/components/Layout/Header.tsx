import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo, logout } from '@store/userSlice';
import { useNavigate } from "react-router-dom";
import { publicAxiosInstance } from '@utils/axiosInstance';
import '@css/Header.css';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);
  
  const handleLogout = async () => {

    try {

      await publicAxiosInstance.post("/auth/admin/logout");
      dispatch(logout());
      navigate("/login");

    } catch (error) {
      console.log(error);
    }

  };

  return (
    <header className="header">
      <div className="header-content">
        <button className="mobile-menu-btn" onClick={onMenuToggle}>
          ☰
        </button>
        <h1>Store Management Admin</h1>
        <div className="header-actions">
          <span>안녕하세요, {userInfo?.userName || '관리자'}님</span>
          <button onClick={handleLogout} className="logout-btn">
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;