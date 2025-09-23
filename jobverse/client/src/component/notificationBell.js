import { useEffect, useState } from "react";
import io from "socket.io-client";
import {axiosCandidate, axiosRecruiter} from "../JWT/axiosClient";
import { Bell, X } from "lucide-react";
import { motion } from "framer-motion";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const socket = io(API_URL);

export default function NotificationBell({ userId, token }) {
  console.log(userId);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Load notifications
  useEffect(() => {
    if (!userId) return;
    fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      if(token !== localStorage.getItem("token_ungvien")){
        const res = await axiosRecruiter.get(`/api/notifications/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      }
      else{
         const res = await axiosCandidate.get(`/api/notifications/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      }
    } catch (err) {
      console.error("Lỗi lấy notifications:", err);
    }
  };

  const handleClickNotification = async (noti) => {
    try {
      // đánh dấu đã đọc
      if(token !== localStorage.getItem("token_ungvien")){
        await axiosRecruiter.put(`/api/notifications/${noti.id}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        // lấy chi tiết message
        const msgRes = await axiosRecruiter.get(`/api/messages/${noti.message_id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setSelectedMessage(msgRes.data);
      }
      else{
        // đánh dấu đã đọc
        await axiosCandidate.put(`/api/notifications/${noti.id}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });

        // lấy chi tiết message
        const msgRes = await axiosCandidate.get(`/api/messages/${noti.message_id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setSelectedMessage(msgRes.data);
      }

      // cập nhật lại danh sách
      fetchNotifications();
    } catch (err) {
      console.error("Lỗi khi mở message:", err);
    }
  };

  // API xoá thông báo
  const handleDeleteNotification = async (id) => {
    try {
      if (!localStorage.getItem("token_ungvien")) {
       await axiosRecruiter.delete(`/api/notifications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
         await axiosCandidate.delete(`/api/notifications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchNotifications(); // refresh
    } catch (err) {
      console.error("Lỗi khi xóa notification:", err);
    }
  };

  // Kết nối socket
  useEffect(() => {
    if (!userId) return;

    socket.emit("register", userId);

    socket.on("new_notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]); // thêm vào đầu
    });

    return () => {
      socket.off("new_notification");
    };
  }, [userId]);

  const unreadCount = notifications.filter(n => n && !n.is_read).length;

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        className="relative p-2 rounded-full hover:bg-gray-100"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Bell className="text-white-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl border z-50"
        >
          <div className="p-2 font-semibold text-teal-700 border-b">Thông báo</div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-gray-500 text-sm">Không có thông báo</div>
            ) : (
              notifications.filter(n => n).map((n) => (
                <div
                  key={n.id}
                  className={`flex justify-between items-start p-3 border-b ${
                    !n.is_read ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => handleClickNotification(n)}
                  >
                    <div className="text-sm text-teal-700">{n.content}</div>
                    <div className="text-xs text-gray-500">
                      {n.subject || "Tin nhắn"}
                    </div>
                  </div>
                  {/* Nút X xoá */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // tránh mở message
                      handleDeleteNotification(n.id);
                    }}
                    className="ml-2 text-gray-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* Modal hiển thị message */}
      {selectedMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl w-[500px]">
            <h2 className="text-lg text-teal-500 font-semibold mb-2">{selectedMessage.subject}</h2>
            <p className="text-gray-700 mb-4">{selectedMessage.content}</p>
            <button
              onClick={() => setSelectedMessage(null)}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
