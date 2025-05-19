import React from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">📂 Dosya Yönetim Uygulaması</div>
      <ul className="nav-links">
        {isLoggedIn ? (
          <>
            <li><Link to="/dosyalarim">Dosyalarım</Link></li>
            <li><Link to="/görsellerim">Görsellerim</Link></li>
            <li><Link to="/tümü">Tümü</Link></li>
            <li><Link to="/ekle">Ekle</Link></li>
            <li><button onClick={handleLogout} className="logout-link">Çıkış Yap</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Giriş Yap</Link></li>
            <li><Link to="/register">Kayıt Ol</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
