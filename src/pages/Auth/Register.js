import React, { useState } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../config';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // 👈 Navigasyon için hook

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor!');
      return;
    }

    try {
      const res = await fetch( baseURL + '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Kayıt başarısız');
      }

      // Başarılı kayıt sonrası giriş ekranına yönlendir
      navigate('/login'); // 👈 Buraya yönlendiriyoruz
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleRegister}>
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

        <input
          type="password"
          placeholder="Şifre (Tekrar)"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && <p className="error-text">{error}</p>}

        <button type="submit">Kayıt Ol</button>
      </form>
    </div>
  );
}
