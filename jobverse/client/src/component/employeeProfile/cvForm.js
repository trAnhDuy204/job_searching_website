import React, { useState, useRef } from "react";
import CVTemplate from "./cvTemplate";
import html2pdf from "html2pdf.js";

export default function CVForm() {
  const [formData, setFormData] = useState({
    title: "CV Ứng viên",
    template_id: 1,
    name: "",
    email: "",
    phone: "",
    experiences: [{ company_name: "", position: "", start_date: "", end_date: "", description: "" }],
    educations: [{ school_name: "", degree: "", start_date: "", end_date: "", description: "" }],
    skills: [{ skill_name: "", level: "" }],
    achievements: [{ title: "", description: "", achieved_at: "" }],
  });

  const cvRef = useRef();

  //download CV
  const handleDownload = () => {
    const element = cvRef.current;
    const opt = {
      margin: [0.3, 0.3, 0.3, 0.3],
      filename: formData.title + ".pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true, logging: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }  // Tránh break giữa sections
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Tạo CV</h2>

      {/* Template hiển thị */}
      <div ref={cvRef}>
        <CVTemplate formData={formData} setFormData={setFormData} />
      </div>

      <div className="flex gap-4 mt-6 mb-6">
        <button
          onClick={handleDownload}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
        >
          Tải xuống PDF
        </button>
      </div>
    </div>
  );
}
