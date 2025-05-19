import React, { useState } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../config';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // 👈 Yönlendirme için

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch( baseURL + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Giriş başarısız');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token); // Token kaydı
      navigate('/tümü'); // 👈 Giriş başarılıysa yönlendir
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Giriş Yap</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error-text">{error}</p>}

        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
}
