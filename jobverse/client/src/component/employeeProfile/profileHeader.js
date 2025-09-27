import { useEffect, useState, useRef } from "react";
import { FaEnvelope, FaPhone, FaUser, FaBirthdayCake } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import {axiosCandidate} from "../../JWT/axiosClient";
import EditProfileModal from "./editProfileModal";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ProfileHeader = () => {
  const [profile, setProfile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    gender: "",
    dob: "",
    phone: "",
    address: "",
    avatar_url: "",
    description: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosCandidate.get("/api/profile/me");
        setProfile(res.data);
        setForm(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy hồ sơ:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosCandidate.put("/api/profile/me", form);
      setProfile(form);
      setIsOpen(false);
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
    }
  };

  const fileInputRef = useRef(null);

  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axiosCandidate.post("/api/profile/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setProfile((prev) => ({ ...prev, avatar_url: res.data.avatar_url }));
    } catch (err) {
      console.error("Lỗi khi upload ảnh:", err);
    }
  };

  //Chỉnh định dang ngày sinh thành dd/mm/yyyy
  const formatDate = (isoDateStr) => {
    if (!isoDateStr) return "";
    const date = new Date(isoDateStr);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  if (!profile) return <div>Đang tải hồ sơ...</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row md:justify-between gap-6 relative">
      {/* Avatar + Tên */}
      <div className="flex gap-4 items-start flex-1">
        <div className="relative w-16 h-16 rounded-full bg-gray-200 cursor-pointer" onClick={() => fileInputRef.current.click()}>
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleUploadAvatar}/>
          {profile.avatar_url && (
            <img src={`${profile.avatar_url}`|| `${API_URL}/uploads/default/avatar_default.svg`} alt="avatar" className="w-full h-full rounded-full object-cover"/>
          )}
          <span className="absolute bottom-0 right-0 bg-white border rounded-full p-1 text-xs shadow">📷</span>
        </div>

        <div className="space-y-1">
          <div className="text-lg font-semibold">{profile.full_name}</div>
          <div className="text-gray-500 text-sm">{profile.address}</div>
        </div>
      </div>

      {/* Thông tin liên hệ */}
      <div className="flex-1 space-y-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-gray-500" />
          <span>{profile.email}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaPhone className="text-gray-500" />
          <span>{profile.phone}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaUser className="text-gray-500" />
          <span>{profile.gender === "nam" ? "Nam" : "Nữ"}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaBirthdayCake className="text-gray-500" />
          <span>{formatDate(profile.dob)}</span>
        </div>
      </div>

      {/* Nút chỉnh sửa */}
      <button onClick={() => setIsOpen(true)} className="absolute top-4 right-4 text-gray-500 hover:text-teal-600">
        <FiEdit2 />
      </button>

      {/* Modal */}
      <EditProfileModal isOpen={isOpen} onClose={() => setIsOpen(false)} form={form} onChange={handleChange} onSubmit={handleSubmit}/>
    </div>
  );
};

export default ProfileHeader;
