import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import '@css/MainLayout.css';

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="main-layout">
      <Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      <div className="main-content">
        <Header onMenuToggle={toggleMobileMenu} />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      />
    </div>
  );
};

export default MainLayout;