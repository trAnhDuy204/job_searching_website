import{ memo } from "react";
import "./style.scss";
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'ungvien',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  //lấy dữ liệu
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //kiểm tra dữ liệu
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('https://jobverse-server.vercel.app/api/auths/register', form);
      setSuccess(res.data.message);
      setTimeout(() => navigate('/dang-nhap'), 2000); // về trang đăng nhập sau 2s
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-teal-200 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-teal-700">Đăng ký tài khoản</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Tên đăng nhập"
            onChange={handleChange}
            value={form.username}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Mật khẩu"
            onChange={handleChange}
            value={form.password}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="ungvien">Ứng viên</option>
            <option value="nhatuyendung">Nhà tuyển dụng</option>
          </select>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Đăng ký
          </button>
        </form>

        {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="mt-4 text-green-500 text-sm text-center">{success}</p>}

        <p className="mt-6 text-sm text-gray-600 text-center">
          Bạn đã có tài khoản? 
          <Link to="/dang-nhap" className="text-teal-600 font-medium hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};


export default memo(RegisterPage);
