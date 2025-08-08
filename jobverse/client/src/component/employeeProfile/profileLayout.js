import Sidebar from "./sidebar";
import ProfileHeader from "./profileHeader";
import CVSection from "./cvSection";
import JobPreference from "./jobPreference";

const ProfileLayout = () => (
  <div className="flex flex-col sm:flex-row gap-6 px-4 py-10 max-w-7xl mx-auto">
    <Sidebar />
    <div className="flex-1 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Hồ sơ cá nhân</h2>
      <ProfileHeader />
      <h2 className="text-2xl font-semibold mb-4">Đăng tải CV có sẵn</h2>
      <CVSection />
      <h2 className="text-2xl font-semibold mb-4">Danh sách tin đã lưu</h2>
      <h2 className="text-2xl font-semibold mb-4">Quản lý nộp đơn ứng tuyển</h2>
      <h2 className="text-2xl font-semibold mb-4">Quản lý tài khoản</h2>
      <JobPreference />
    </div>
  </div>
);

export default ProfileLayout;
