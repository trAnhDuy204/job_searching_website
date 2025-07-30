import{ memo } from "react";
import "./style.scss";
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('http://localhost:5000/api/login', form);

      setSuccess(res.data.message);
      localStorage.setItem('user', JSON.stringify(res.data.user)); // lưu user nếu cần

      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đăng nhập');
    }
  };

  return (
    <div className="login_form">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleLogin}>
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <br />
        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Mật khẩu" required />
        <br />
        <button type="submit">Đăng nhập</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default memo(LoginPage);