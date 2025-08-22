const SidebarEmployer = () => (
  <div className="bg-white rounded-xl shadow-md p-4 w-full sm:w-72 space-y-4 sticky top-4 h-fit">

    <div className="space-y-2">
      <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
        <span>
          <a href="#ho-so-ca-nhan" className="block font-medium hover:text-teal-600">Hồ sơ của tôi</a>
        </span>
      </div>

      <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
        <span>
          <a href="#ho-so-cong-ty" className="block font-medium hover:text-teal-600">Xây dựng hồ sơ công ty</a>
        </span>
      </div>

      <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
        <span>
          <a href="#quan-ly-tin-tuyen-dung" className="block font-medium hover:text-teal-600">Quản lý tin tuyển dụng</a>
        </span>
      </div>

      <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
        <span>
          <a href="#quan-ly-don-ung-tuyen" className="block font-medium hover:text-teal-600">Quản lý đơn ứng tuyển</a>
        </span>
      </div>

      <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
        <span>
          <a href="#quan-ly-tai-khoan" className="block font-medium hover:text-teal-600">Quản lý tài khoản</a>
        </span>
      </div>
    </div>
  </div>
);

export default SidebarEmployer;
