import { useState } from "react";
import {axiosRecruiter} from "../../JWT/axiosClient";

export default function AccountManagement() {
  const [tab, setTab] = useState("email");

  // State đổi email
  const [email, setEmail] = useState("");
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState("");
  
  // State đổi mật khẩu
  const [currentPasswordForPass, setCurrentPasswordForPass] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Thông báo
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");

  const token = localStorage.getItem("token_ungvien");

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosRecruiter.put( "/account/update-email",
        { email, currentPassword: currentPasswordForEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setType("success");
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi khi đổi email");
      setType("error");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosRecruiter.put( "/account/update-password",
        { currentPassword: currentPasswordForPass, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setType("success");
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi khi đổi mật khẩu");
      setType("error");
    }
  };

  return (
    <div className=" max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex border-b mb-4">
        <button
          onClick={() => setTab("email")}
          className={`flex-1 py-2 ${tab === "email" ? "border-b-2 border-teal-500 font-bold" : "text-gray-500"}`}
        >
          Đổi Email
        </button>
        <button
          onClick={() => setTab("password")}
          className={`flex-1 py-2 ${tab === "password" ? "border-b-2 border-teal-500 font-bold" : "text-gray-500"}`}
        >
          Đổi Mật khẩu
        </button>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {tab === "email" && (
        <form onSubmit={handleUpdateEmail} className="space-y-4">
          <div>
            <label className="block mb-1">Email mới</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Mật khẩu hiện tại</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={currentPasswordForEmail}
              onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
              required
            />
          </div>
          <button className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600">
            Cập nhật Email
          </button>
        </form>
      )}

      {tab === "password" && (
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block mb-1">Mật khẩu hiện tại</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={currentPasswordForPass}
              onChange={(e) => setCurrentPasswordForPass(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Mật khẩu mới</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600">
            Cập nhật Mật khẩu
          </button>
        </form>
      )}
    </div>
  );
}
