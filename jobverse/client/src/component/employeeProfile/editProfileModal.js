import { Dialog } from "@headlessui/react";

const EditProfileModal = ({ isOpen, onClose, form, onChange, onSubmit }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />

      {/* Centered panel */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <Dialog.Panel className="bg-white rounded-xl p-6 shadow-xl w-[90%] max-w-xl relative">
          <Dialog.Title className="text-lg font-semibold mb-4">Chỉnh sửa hồ sơ</Dialog.Title>

          <form className="space-y-3" onSubmit={onSubmit}>
            <input className="w-full border px-3 py-2 rounded" placeholder="Họ và tên" value={form.full_name || ""} onChange={(e) => onChange("full_name", e.target.value)} />
            <select className="w-full border px-3 py-2 rounded" value={form.gender || ""} onChange={(e) => onChange("gender", e.target.value)}>
              <option value="">Chọn giới tính</option>
              <option value="nam">Nam</option>
              <option value="nữ">Nữ</option>
            </select>
            <input className="w-full border px-3 py-2 rounded" type="date" value={form.dob?.slice(0, 10) || ""} onChange={(e) => onChange("dob", e.target.value)} />
            <input className="w-full border px-3 py-2 rounded" placeholder="Số điện thoại" value={form.phone || ""} onChange={(e) => onChange("phone", e.target.value)} />
            <input className="w-full border px-3 py-2 rounded" placeholder="Địa chỉ" value={form.address || ""} onChange={(e) => onChange("address", e.target.value)} />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Hủy</button>
              <button type="submit"  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">Lưu</button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditProfileModal;
