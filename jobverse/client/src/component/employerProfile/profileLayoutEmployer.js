import ProfileHeader from "../employerProfile/profileHeader";
import CompanyProfileHeader from "./companyProfile";
import SidebarEmployer from "./sidebarEmpoyer";
import JobManagement from "./jobManagement"
import ApplicationManagement from "./applicationManagement";
import AccountManagement from "./accountManagement";

const ProfileLayoutEmployer = () => (
  <div className="flex flex-col sm:flex-row gap-6 px-4 py-10 max-w-7xl mx-auto">
    <SidebarEmployer />
    <div className="flex-1 space-y-6">
      <h2 id="ho-so-ca-nhan" className="text-2xl font-semibold mb-4">Hồ sơ cá nhân</h2>
      <ProfileHeader />
      <h2 id="ho-so-cong-ty" className="text-2xl font-semibold mb-4">Hồ sơ công ty</h2>
      <CompanyProfileHeader/>
      <h2 id="quan-ly-tin-tuyen-dung" className="text-2xl font-semibold mb-4">Quản lý tin tuyển dụng</h2>
      <JobManagement/>
      <h2 id="quan-ly-don-ung-tuyen" className="text-2xl font-semibold mb-4">Quản lý Đơn ứng tuyển</h2>
      <ApplicationManagement/>
      <h2 id="quan-ly-tai-khoan" className="text-2xl font-semibold mb-4">Quản lý tài khoản</h2>
      <AccountManagement/>
    </div>
  </div>
);

export default ProfileLayoutEmployer;
