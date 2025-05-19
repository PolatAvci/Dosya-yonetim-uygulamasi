import React from 'react';
import './Unauth.css';
import { useNavigate } from 'react-router-dom';

export default function Unauth() {
    const navigate = useNavigate();

    return (
        <div className="login-warning-wrapper">
            <div className="login-warning-card">
                <h1>🔒 Erişim Engellendi</h1>
                <p>Görsel ve dosyalarınızı görüntülemek için giriş yapmalısınız.</p>
                <button className="login-button" onClick={() => navigate('/login')}>Giriş Yap</button>
            </div>
        </div>
    );
}