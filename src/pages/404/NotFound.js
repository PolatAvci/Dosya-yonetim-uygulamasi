import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-wrapper">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-message">Üzgünüz, aradığınız sayfa bulunamadı.</p>
      <button className="notfound-button" onClick={() => navigate('/')}>
        Ana Sayfaya Dön
      </button>
    </div>
  );
}
