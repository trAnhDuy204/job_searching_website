import { FiEdit2 } from "react-icons/fi";
const JobPreference = () => (
  <div className="p-6 bg-white rounded-xl shadow-md">
    <div className="flex justify-between items-center mb-3">
      <h4 className="text-lg font-semibold">Tiêu chí tìm việc</h4>
      <button className="absolute top-30 right-40 text-gray-500 hover:text-teal-600">
        <FiEdit2 />
      </button>
    </div>
    <div className="grid sm:grid-cols-2 gap-4 text-sm">
      <div><strong>Vị trí:</strong> Nhân Viên IT</div>
      <div><strong>Mức lương:</strong> <a className="text-blue-600" href="#">Thêm mức lương</a></div>
      <div><strong>Ngành nghề:</strong> <a className="text-blue-600" href="#">Thêm ngành nghề</a></div>
      <div><strong>Hình thức:</strong> <a className="text-blue-600" href="#">Thêm hình thức làm việc</a></div>
    </div>
  </div>
);

export default JobPreference;
