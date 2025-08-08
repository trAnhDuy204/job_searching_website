import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";
import {axiosCandidate} from "../../JWT/axiosClient";

const EditCompanyModal = ({ isOpen, onClose, form, onChange, onSubmit }) => {
  const fileInputRef = useRef(null);

  const handleUploadLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file); // tên field trùng với backend

    try {
        const res = await axiosCandidate.post("/company/upload-logo", formData, {
        headers: { "Content-Type": "multipart/form-data" }
        });
        // cập nhật logo_url vào form
        onChange("logo_url", res.data.logoUrl);
    } catch (err) {
        console.error("Lỗi khi upload logo:", err);
    }
  };


  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" leave="ease-in duration-200"
          enterFrom="opacity-0" enterTo="opacity-100"
          leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300" leave="ease-in duration-200"
              enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                <Dialog.Title className="text-xl font-bold text-gray-800 mb-4">
                  Chỉnh sửa hồ sơ công ty
                </Dialog.Title>

                <form onSubmit={onSubmit} className="space-y-4">
                  {/* Logo upload */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border">
                      {form.logo_url ? (
                        <img
                          src={`http://localhost:5000${form.logo_url}`}
                          alt="logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="flex items-center justify-center w-full h-full text-sm text-gray-400">No logo</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Tải logo lên
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadLogo}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tên công ty</label>
                      <input
                        type="text"
                        value={form.company_name}
                        onChange={(e) => onChange("company_name", e.target.value)}
                        className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ngành nghề</label>
                      <input
                        type="text"
                        value={form.industry}
                        onChange={(e) => onChange("industry", e.target.value)}
                        className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quy mô</label>
                      <input
                        type="text"
                        value={form.company_size}
                        onChange={(e) => onChange("company_size", e.target.value)}
                        className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Website</label>
                      <input
                        type="text"
                        value={form.website}
                        onChange={(e) => onChange("website", e.target.value)}
                        className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả công ty</label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => onChange("description", e.target.value)}
                      className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Địa chỉ công ty</label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => onChange("address", e.target.value)}
                      className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 mr-3"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditCompanyModal;
