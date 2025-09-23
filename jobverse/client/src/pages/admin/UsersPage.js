import { useEffect, useState } from "react";
import {axiosAdmin} from "../../JWT/axiosClient";
import UserDetailModal from "../../component/admin/UserDetailModal";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    const res = await axiosAdmin.get("/api/admin/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (window.confirm("Xóa user này?")) {
      await axiosAdmin.delete(`/api/admin/users/${id}`);
      fetchUsers();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Danh sách Người dùng</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{u.id}</td>
              <td className="border p-2">{u.username}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.role}</td>
              <td className="border p-2 text-center">
                <button 
                  onClick={() => setSelectedUser(u.id)} 
                  className="px-2 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
                >
                    Xem chi tiết
                </button>

                <button
                  onClick={() => deleteUser(u.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
      <UserDetailModal
        userId={selectedUser}
        onClose={() => setSelectedUser(null)}
        onDeleted={() => fetchUsers()}
      />
    )}
    </div>
  );
}
