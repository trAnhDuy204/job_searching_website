import { memo, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './style.scss';

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
      const res = await axios.post('http://localhost:5000/api/auths/login', form);

      const { token, user, message } = res.data;

      if (!user?.role) {
        setError('Không xác định được quyền truy cập');
        return;
      }

      // Lưu token và user vào localStorage theo role
      const roleKey = `token_${user.role}`;
      localStorage.setItem(roleKey, token);

      const userKey = `user_${user.role}`;
      localStorage.setItem(userKey, JSON.stringify(user));

      setSuccess(message || 'Đăng nhập thành công');

      // Điều hướng theo vai trò
      setTimeout(() => {
        switch (user.role) {
          case 'ungvien':
            navigate('/trang-ung-vien');
            break;
          case 'nhatuyendung':
            navigate('/trang-nha-tuyen-dung');
            break;
          case 'admin':
            navigate('/trang-quan-tri-vien');
            break;
          default:
            navigate('/');
        }
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đăng nhập');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-teal-200 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-teal-700">Đăng nhập</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Mật khẩu"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Đăng nhập
          </button>
        </form>

        {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="mt-4 text-green-500 text-sm text-center">{success}</p>}

        <p className="mt-6 text-sm text-gray-600 text-center">
          Bạn chưa có tài khoản?
          <Link to="/dang-ky" className="text-teal-600 font-medium hover:underline">Đăng ký</Link>
        </p>
      </div>
    </div>
  );
};

export default memo(LoginPage);
