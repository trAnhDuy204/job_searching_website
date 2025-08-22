import Sidebar from "./sidebar";
import ProfileHeader from "./profileHeader";
import AccountManagement from "./accountManagement";
import SavedJobsList from "./savedJobList";
import AppliedJobsManagement from "./applicatedJobManagement";

const ProfileLayout = () => (
  <div className="flex flex-col sm:flex-row gap-6 px-4 py-10 max-w-7xl mx-auto">
    <Sidebar />
    <div className="flex-1 space-y-6">
      <h2 id="ho-so-ca-nhan" className="text-2xl font-semibold mb-4">Hồ sơ cá nhân</h2>
      <ProfileHeader />
      <h2 id="danh-sach-tin-da-luu" className="text-2xl font-semibold mb-4">Danh sách tin đã lưu</h2>
      <SavedJobsList/>
      <h2 id="quan-ly-nop-don" className="text-2xl font-semibold mb-4">Quản lý nộp đơn ứng tuyển</h2>
      <AppliedJobsManagement/>
      <h2 id="quan-ly-tai-khoan" className="text-2xl font-semibold mb-4">Quản lý tài khoản</h2>
      <AccountManagement/>
    </div>
  </div>
);

export default ProfileLayout;
