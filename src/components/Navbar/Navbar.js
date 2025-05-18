import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';


function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">📂 Dosya Yönetim Uygulaması</div>
      <ul className="nav-links">
        <li><Link to="/dosyalarim">Dosyalarım</Link></li>
        <li><Link to="/görsellerim">Görsellerim</Link></li>
        <li><Link to="/tümü">Tümü</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
