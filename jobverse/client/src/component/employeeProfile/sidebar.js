const Sidebar = () => (
  <div className="bg-white rounded-xl shadow-md p-4 w-full sm:w-72 space-y-4 sticky top-4 h-fit">

    <div className="space-y-2">
      <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
        <span>
          <a href="#ho-so-ca-nhan" className="block font-medium hover:text-teal-600">
            Hồ sơ của tôi
          </a>
        </span>
      </div>

      <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
        <span>
          <a href="#danh-sach-tin-da-luu" className="block font-medium hover:text-teal-600">
            Danh sách tin đã lưu
          </a>
        </span>
      </div>

      <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
        <span>
          <a href="#quan-ly-nop-don" className="block font-medium hover:text-teal-600">
            Quản lý nộp đơn ứng tuyển
          </a>
        </span>
      </div>

      <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
        <span>
          <a href="#quan-ly-tai-khoan" className="block font-medium hover:text-teal-600">
            Quản lý tài khoản
          </a>
        </span>
      </div>
    </div>
  </div>
);

export default Sidebar;
