const Sidebar = () => (
  <div className="bg-white rounded-xl shadow-md p-4 w-full sm:w-72 space-y-4">
    <div>
      <h2 className="font-bold text-lg">Trần Hà Anh Duy</h2>
      <p className="text-sm text-gray-500">Nhân Viên IT</p>
    </div>

    <div className="space-y-2">
      <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
        <span>
          <a href="#" className="block font-medium hover:text-teal-600">📝 Hồ sơ của tôi</a>
        </span>
      </div>

      <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
        <span>
          <a href="#" className="block font-medium hover:text-teal-600">Tải lên CV có sẵn</a>
        </span>
      </div>

      <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
        <span>
          <a href="#" className="block font-medium hover:text-teal-600">Danh sách tin đã lưu</a>
        </span>
      </div>

      <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
        <span>
          <a href="#" className="block font-medium hover:text-teal-600">Quản lý nộp đơn ứng tuyển</a>
        </span>
      </div>

      <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
        <span>
          <a href="#" className="block font-medium hover:text-teal-600">👤 Quản lý tài khoản</a>
        </span>
      </div>
    </div>
  </div>
);

export default Sidebar;
