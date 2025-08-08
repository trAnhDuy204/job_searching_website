const CVSection = () => (
  <div className="p-6 bg-white rounded-xl shadow-md">
    <h4 className="text-lg font-semibold mb-3">CV của tôi</h4>
    <div className="border-dashed border-2 border-purple-300 p-4 text-center rounded-lg">
      <button className="text-purple-600 font-medium flex items-center justify-center gap-2">
        📤 Tải lên CV có sẵn
      </button>
      <p className="text-xs mt-2 text-gray-400">Hỗ trợ: doc, docx, pdf, tối đa 5MB</p>
    </div>
  </div>
);

export default CVSection;
