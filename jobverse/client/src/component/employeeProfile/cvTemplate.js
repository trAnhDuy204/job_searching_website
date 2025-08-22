import React, { useState } from "react";

// Ảnh đại diện mặc định
const DEFAULT_AVATAR = "http://localhost:5000/uploads/default/avatar_default.svg";

export default function CVTemplate() {
  const [avatar, setAvatar] = useState(null);

  // Dữ liệu mẫu/khởi tạo
  const [data, setData] = useState({
    personal: {
      fullName: "Họ Tên",
      position: "Vị trí ứng tuyển",
      dob: "DD/MM/YYYY",
      gender: "Nam/Nữ",
      phone: "0123456789",
      email: "example@gmail.com",
      website: "facebook.com",
      address: "Quận A, thành phố Hà Nội",
    },
    objective:
      "Mục tiêu nghề nghiệp của bạn, bao gồm mục tiêu ngắn hạn và dài hạn",
    educations: [
      {
        time: "Bắt đầu – Kết thúc",
        school: "Tên trường học",
        degree: "Ngành học / Môn học",
        desc: "Thành tựu học tập hoặc thành tích nổi bật",
      },
    ],
    experiences: [
      {
        time: "Bắt đầu – Kết thúc",
        company: "Tên công ty",
        role: "Vị trí công việc",
        desc: "Mô tả kinh nghiệm làm việc của bạn",
      },
    ],
    activities: [
      { time: "Bắt đầu – Kết thúc", org: "Tên tổ chức", role: "Vị trí", desc: "Mô tả hoạt động" },
    ],
    certificates: [
      { time: "Thời gian", name: "Tên chứng chỉ", desc: "Mô tả" },
    ],
    awards: [
      { time: "Thời gian", name: "Tên giải thưởng", desc: "Mô tả" },
    ],
    skills: [
      { name: "Kỹ năng", level: "Cơ bản/Trung bình/Nâng cao", note: "" },
    ],
    references: [
      { name: "Tên người tham chiếu", phone: "Số điện thoại", email: "Email", note: "" },
    ],
    hobbies: "Điền các sở thích của bạn",
  });

  // Helper cập nhật mảng
  const updateItem = (key, idx, field, value) => {
    setData((prev) => {
      const next = { ...prev };
      const arr = [...next[key]];
      arr[idx] = { ...arr[idx], [field]: value };
      next[key] = arr;
      return next;
    });
  };

  const addItem = (key, empty) =>
    setData((prev) => ({ ...prev, [key]: [...prev[key], empty] }));

  const removeItem = (key, idx) =>
    setData((prev) => {
      const arr = prev[key].slice();
      arr.splice(idx, 1);
      return { ...prev, [key]: arr };
    });

  // Avatar -> base64 để render trong HTML
  const onPickAvatar = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(f);
  };

  // Styles đơn giản giống bố cục
  const sectionCls = "border-t border-gray-300 pt-3 mt-3";

  return (
    <div>
      {/* CSS cho print/PDF */}
      <style>{`
        @media print {
          body { font-family: Arial, sans-serif; font-size: 13px; line-height: 1.4; }
          .group button, .hidden, .border-dotted { display: none !important; border: none !important; }
          .opacity-0 { opacity: 0 !important; }
          .bg-gray-100 { background-color: #f3f3f3 !important; }
          .grid { display: flex !important; flex-wrap: wrap; }
          .grid-cols-2 > div { flex: 1 1 50%; }
          .mb-2, .group { page-break-inside: avoid; }
          img { max-width: 100px; height: auto; }
        }
      `}</style>

      {/* Khu vực CV để xuất PDF */}
      <div className="bg-white shadow border border-gray-200 p-4 text-[13px] leading-5 font-sans">
        {/* Header */}
        <div className="flex items-start gap-3 border border-gray-300 p-3">
          <div className="relative group flex-shrink-0">
            <img
              src={avatar || DEFAULT_AVATAR}
              alt="avatar"
              className="w-[100px] h-[100px] object-cover border"
            />
            <label className="absolute left-0 bottom-0 bg-teal-600 text-white text-xs px-2 py-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Sửa ảnh
              <input
                type="file"
                accept="image/*"
                onChange={onPickAvatar}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex-grow">
            <h1
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                setData((d) => ({
                  ...d,
                  personal: { ...d.personal, fullName: e.target.innerText },
                }))
              }
              className="text-xl font-bold"
            >
              {data.personal.fullName}
            </h1>

            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mt-1">
              <FieldLine
                label="Vị trí ứng tuyển"
                value={data.personal.position}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    personal: { ...d.personal, position: v },
                  }))
                }
              />
              <FieldLine
                label="Ngày sinh"
                value={data.personal.dob}
                onChange={(v) =>
                  setData((d) => ({ ...d, personal: { ...d.personal, dob: v } }))
                }
              />
              <FieldLine
                label="Giới tính"
                value={data.personal.gender}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    personal: { ...d.personal, gender: v },
                  }))
                }
              />
              <FieldLine
                label="Số điện thoại"
                value={data.personal.phone}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    personal: { ...d.personal, phone: v },
                  }))
                }
              />
              <FieldLine
                label="Email"
                value={data.personal.email}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    personal: { ...d.personal, email: v },
                  }))
                }
              />
              <FieldLine
                label="Website"
                value={data.personal.website}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    personal: { ...d.personal, website: v },
                  }))
                }
              />
              <FieldLine
                label="Địa chỉ"
                full
                value={data.personal.address}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    personal: { ...d.personal, address: v },
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Mục tiêu nghề nghiệp */}
        <Section title="MỤC TIÊU NGHỀ NGHIỆP" className={sectionCls}>
          <EditableParagraph
            value={data.objective}
            onChange={(v) => setData((d) => ({ ...d, objective: v }))}
          />
        </Section>

        {/* Học vấn */}
        <Repeater
          title="HỌC VẤN"
          className={sectionCls}
          items={data.educations}
          onAdd={() =>
            addItem("educations", {
              time: "Bắt đầu – Kết thúc",
              school: "Tên trường học",
              degree: "Ngành học / Môn học",
              desc: "",
            })
          }
          renderItem={(item, i) => (
            <div className="group flex gap-4 mb-2">
              <div className="flex-shrink-0 w-[160px]">
                <Inline value={item.time} onChange={(v) => updateItem("educations", i, "time", v)} />
              </div>
              <div className="flex-grow">
                <div className="font-semibold">
                  <Inline value={item.school} onChange={(v) => updateItem("educations", i, "school", v)} />
                </div>
                <div className="text-sm">
                  <Inline value={item.degree} onChange={(v) => updateItem("educations", i, "degree", v)} />
                </div>
                <EditableParagraph
                  value={item.desc}
                  onChange={(v) => updateItem("educations", i, "desc", v)}
                />
              </div>
              <RowActions onRemove={() => removeItem("educations", i)} />
            </div>
          )}
        />

        {/* Kinh nghiệm làm việc */}
        <Repeater
          title="KINH NGHIỆM LÀM VIỆC"
          className={sectionCls}
          items={data.experiences}
          onAdd={() =>
            addItem("experiences", {
              time: "Bắt đầu – Kết thúc",
              company: "Tên công ty",
              role: "Vị trí công việc",
              desc: "",
            })
          }
          renderItem={(item, i) => (
            <div className="group flex gap-4 mb-2">
              <div className="flex-shrink-0 w-[160px]">
                <Inline value={item.time} onChange={(v) => updateItem("experiences", i, "time", v)} />
              </div>
              <div className="flex-grow">
                <div className="font-semibold">
                  <Inline value={item.company} onChange={(v) => updateItem("experiences", i, "company", v)} />
                </div>
                <div className="text-sm">
                  <Inline value={item.role} onChange={(v) => updateItem("experiences", i, "role", v)} />
                </div>
                <EditableParagraph
                  value={item.desc}
                  onChange={(v) => updateItem("experiences", i, "desc", v)}
                />
              </div>
              <RowActions onRemove={() => removeItem("experiences", i)} />
            </div>
          )}
        />

        {/* Hoạt động */}
        <Repeater
          title="HOẠT ĐỘNG"
          className={sectionCls}
          items={data.activities}
          onAdd={() =>
            addItem("activities", {
              time: "Bắt đầu – Kết thúc",
              org: "Tên tổ chức",
              role: "Vị trí",
              desc: "",
            })
          }
          renderItem={(item, i) => (
            <div className="group flex gap-4 mb-2">
              <div className="flex-shrink-0 w-[160px]">
                <Inline value={item.time} onChange={(v) => updateItem("activities", i, "time", v)} />
              </div>
              <div className="flex-grow">
                <div className="font-semibold">
                  <Inline value={item.org} onChange={(v) => updateItem("activities", i, "org", v)} />
                </div>
                <div className="text-sm">
                  <Inline value={item.role} onChange={(v) => updateItem("activities", i, "role", v)} />
                </div>
                <EditableParagraph
                  value={item.desc}
                  onChange={(v) => updateItem("activities", i, "desc", v)}
                />
              </div>
              <RowActions onRemove={() => removeItem("activities", i)} />
            </div>
          )}
        />

        {/* Chứng chỉ */}
        <Repeater
          title="CHỨNG CHỈ"
          className={sectionCls}
          items={data.certificates}
          onAdd={() =>
            addItem("certificates", { time: "Thời gian", name: "Tên chứng chỉ", desc: "" })
          }
          renderItem={(item, i) => (
            <div className="group flex gap-4 mb-2">
              <div className="flex-shrink-0 w-[160px]">
                <Inline value={item.time} onChange={(v) => updateItem("certificates", i, "time", v)} />
              </div>
              <div className="flex-grow">
                <div className="font-semibold">
                  <Inline value={item.name} onChange={(v) => updateItem("certificates", i, "name", v)} />
                </div>
                <EditableParagraph
                  value={item.desc}
                  onChange={(v) => updateItem("certificates", i, "desc", v)}
                />
              </div>
              <RowActions onRemove={() => removeItem("certificates", i)} />
            </div>
          )}
        />

        {/* Danh hiệu & Giải thưởng */}
        <Repeater
          title="DANH HIỆU VÀ GIẢI THƯỞNG"
          className={sectionCls}
          items={data.awards}
          onAdd={() =>
            addItem("awards", { time: "Thời gian", name: "Tên giải thưởng", desc: "" })
          }
          renderItem={(item, i) => (
            <div className="group flex gap-4 mb-2">
              <div className="flex-shrink-0 w-[160px]">
                <Inline value={item.time} onChange={(v) => updateItem("awards", i, "time", v)} />
              </div>
              <div className="flex-grow">
                <div className="font-semibold">
                  <Inline value={item.name} onChange={(v) => updateItem("awards", i, "name", v)} />
                </div>
                <EditableParagraph
                  value={item.desc}
                  onChange={(v) => updateItem("awards", i, "desc", v)}
                />
              </div>
              <RowActions onRemove={() => removeItem("awards", i)} />
            </div>
          )}
        />

        {/* Kỹ năng */}
        <Repeater
          title="KỸ NĂNG"
          className={sectionCls}
          items={data.skills}
          onAdd={() =>
            addItem("skills", { name: "Tên kỹ năng", level: "Cơ bản", note: "" })
          }
          renderItem={(item, i) => (
            <div className="group flex gap-4 mb-2">
              <div className="flex-shrink-0 w-[200px]">
                <Inline value={item.name} onChange={(v) => updateItem("skills", i, "name", v)} />
              </div>
              <div className="flex-grow">
                <div className="text-sm">
                  Mức độ:{" "}
                  <Inline value={item.level} onChange={(v) => updateItem("skills", i, "level", v)} />
                </div>
                <EditableParagraph
                  value={item.note}
                  onChange={(v) => updateItem("skills", i, "note", v)}
                />
              </div>
              <RowActions onRemove={() => removeItem("skills", i)} />
            </div>
          )}
        />

        {/* Người giới thiệu */}
        <Repeater
          title="NGƯỜI GIỚI THIỆU"
          className={sectionCls}
          items={data.references}
          onAdd={() =>
            addItem("references", {
              name: "Tên người tham chiếu",
              phone: "Số điện thoại",
              email: "Email",
              note: "",
            })
          }
          renderItem={(item, i) => (
            <div className="group mb-2">
              <div className="font-semibold">
                <Inline value={item.name} onChange={(v) => updateItem("references", i, "name", v)} />
              </div>
              <div className="text-sm">
                SĐT:{" "}
                <Inline value={item.phone} onChange={(v) => updateItem("references", i, "phone", v)} />
                {"  "}— Email:{" "}
                <Inline value={item.email} onChange={(v) => updateItem("references", i, "email", v)} />
              </div>
              <EditableParagraph
                value={item.note}
                onChange={(v) => updateItem("references", i, "note", v)}
              />
              <RowActions onRemove={() => removeItem("references", i)} />
            </div>
          )}
        />

        {/* Sở thích */}
        <Section title="SỞ THÍCH" className={sectionCls}>
          <EditableParagraph
            value={data.hobbies}
            onChange={(v) => setData((d) => ({ ...d, hobbies: v }))}
          />
        </Section>
      </div>
    </div>
  );
}

// Dòng nhãn:giá trị editable
function FieldLine({ label, value, onChange, full = false }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <span className="text-xs text-gray-500">{label}: </span>
      <Inline value={value} onChange={onChange} />
    </div>
  );
}

// Văn bản có thể sửa inline
function Inline({ value, onChange }) {
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange?.(e.currentTarget.innerText)}
      className="border-b border-dotted border-gray-400 outline-none"
    >
      {value}
    </span>
  );
}

// Đoạn văn editable (giữ xuống dòng)
function EditableParagraph({ value, onChange }) {
  return (
    <div
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange?.(e.currentTarget.innerText)}
      className="outline-none whitespace-pre-wrap"
    >
      {value}
    </div>
  );
}

function Section({ title, children, className = "" }) {
  return (
    <div className={className}>
      <div className="bg-gray-100 px-3 py-1 font-bold text-[13px]">{title}</div>
      <div className="px-3 py-2">{children}</div>
    </div>
  );
}

function Repeater({ title, items, renderItem, onAdd, className = "" }) {
  return (
    <div className={`${className} group`}>
      <div className="bg-gray-100 px-3 py-1 font-bold text-[13px] flex items-center justify-between">
        <span>{title}</span>
        <button
          onClick={onAdd}
          className="text-xs px-2 py-0.5 rounded bg-teal-600 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          + Thêm
        </button>
      </div>
      <div className="px-3 py-2">
        {items.map((it, i) => (
          <div key={i}>{renderItem(it, i)}</div>
        ))}
      </div>
    </div>
  );
}

function RowActions({ onRemove }) {
  return (
    <div className="flex justify-end -mt-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <button
        onClick={onRemove}
        className="text-xs px-2 py-1 rounded bg-red-600 text-white"
      >
        Xóa mục
      </button>
    </div>
  );
}