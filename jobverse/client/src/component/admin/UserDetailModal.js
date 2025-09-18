import React, { useEffect, useState } from "react";
import {axiosAdmin} from "../../JWT/axiosClient";

export default function UserDetailModal({ userId, onClose, onDeleted }) {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token_admin") || localStorage.getItem("token_nhatuyendung");

  useEffect(() => {
    if (!userId) return;
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const res = await axiosAdmin.get(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Lỗi lấy user:", err);
      alert("Không tải được thông tin user");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn chắc chắn muốn xóa user này?")) return;
    try {
      await axiosAdmin.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDeleted?.();
      onClose();
    } catch (err) {
      console.error("Lỗi xóa user:", err);
      alert("Xóa user thất bại");
    }
  };

  if (!userId) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg max-w-xl w-full p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">Chi tiết người dùng</h3>
        </div>

        {!user ? (
          <div className="py-8 text-center">Đang tải...</div>
        ) : (
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar_url ? `http://localhost:5000${user.avatar_url}` : "http://localhost:5000/uploads/default/avatar_default.svg"}
                alt="avatar"
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <div className="font-semibold text-lg">{user.full_name || user.username}</div>
                <div className="text-xs text-gray-500">Role: {user.role}</div>
                <div className="text-xs text-gray-500">Đăng ký: {new Date(user.created_at).toLocaleString()}</div>
              </div>
            </div>

            <div><b>Email:</b> {user.email}</div>
            <div><b>Số điện thoại:</b> {user.phone || "—"}</div>
            <div><b>Ngày sinh:</b> {user.dob ? new Date(user.dob).toLocaleDateString() : "—"}</div>
            <div><b>Địa chỉ:</b> {user.address || "—"}</div>
            <div><b>Mô tả:</b> <div className="whitespace-pre-line">{user.description || "—"}</div></div>

            <div className="flex justify-end gap-2 pt-3">
              <button onClick={handleDelete} className="px-3 py-1 bg-red-500 text-white rounded">Xóa</button>
              <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">Đóng</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
