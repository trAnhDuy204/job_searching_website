import ProfileHeader from "../employerProfile/profileHeader";
import CompanyProfileHeader from "./companyProfile";
import SidebarEmployer from "./sidebarEmpoyer";

const ProfileLayoutEmployer = () => (
  <div className="flex flex-col sm:flex-row gap-6 px-4 py-10 max-w-7xl mx-auto">
    <SidebarEmployer />
    <div className="flex-1 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Hồ sơ cá nhân</h2>
      <ProfileHeader />
      <h2 className="text-2xl font-semibold mb-4">Hồ sơ công ty</h2>
      <CompanyProfileHeader/>
      <h2 className="text-2xl font-semibold mb-4">Quản lý tin tuyển dụng</h2>
      <h2 className="text-2xl font-semibold mb-4">Quản lý Đơn ứng tuyển</h2>
      <h2 className="text-2xl font-semibold mb-4">Quản lý tài khoản</h2>
    </div>
  </div>
);

export default ProfileLayoutEmployer;
