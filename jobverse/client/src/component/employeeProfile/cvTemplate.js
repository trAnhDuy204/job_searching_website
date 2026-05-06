import React, { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const DEFAULT_AVATAR = `${API_URL}/uploads/default/avatar_default.svg`;

export default function CVTemplate() {
  const [avatar, setAvatar] = useState(null);
  const [data, setData] = useState({
    personal: {
      fullName: "Họ và Tên",
      position: "Vị trí ứng tuyển",
      dob: "DD/MM/YYYY",
      gender: "Nam/Nữ",
      phone: "0123 456 789",
      email: "example@gmail.com",
      website: "facebook.com/yourname",
      address: "Quận A, Thành phố Hà Nội",
    },
    objective: "Mục tiêu nghề nghiệp của bạn, bao gồm mục tiêu ngắn hạn và dài hạn. Mô tả ngắn gọn định hướng phát triển và giá trị bạn mang lại cho doanh nghiệp.",
    educations: [{
      time: "2019 – 2023",
      school: "Tên trường đại học",
      degree: "Ngành học / Chuyên ngành",
      desc: "Thành tích nổi bật, GPA, học bổng...",
    }],
    experiences: [{
      time: "2023 – Nay",
      company: "Tên công ty",
      role: "Vị trí công việc",
      desc: "Mô tả công việc và thành tựu đạt được trong vai trò này.",
    }],
    activities: [{
      time: "2021 – 2022",
      org: "Tên tổ chức / CLB",
      role: "Vị trí",
      desc: "Mô tả hoạt động và đóng góp của bạn.",
    }],
    certificates: [{ time: "2022", name: "Tên chứng chỉ", desc: "Tổ chức cấp" }],
    awards: [{ time: "2023", name: "Tên giải thưởng", desc: "Đơn vị trao tặng" }],
    skills: [
      { name: "Kỹ năng 1", level: 80, note: "Mô tả kỹ năng" },
      { name: "Kỹ năng 2", level: 65, note: "" },
    ],
    references: [{
      name: "Người tham chiếu",
      phone: "0123 456 789",
      email: "ref@email.com",
      note: "Chức vụ, công ty",
    }],
    hobbies: "Đọc sách, Du lịch, Nhiếp ảnh",
  });

  const updateItem = (key, idx, field, value) => {
    setData((prev) => {
      const arr = [...prev[key]];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, [key]: arr };
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

  const onPickAvatar = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(f);
  };

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@300;400;600&display=swap');
        .cv-root { font-family: 'Source Sans 3', sans-serif; }
        .cv-root h1 { font-family: 'Playfair Display', serif; }
        [contenteditable]:focus { background: rgba(13,148,136,0.06); border-radius: 2px; outline: none; }
        [contenteditable]:hover { background: rgba(13,148,136,0.04); border-radius: 2px; }
        @media print {
          .no-print { display: none !important; }
          .cv-root { font-size: 12px; }
          [contenteditable] { background: transparent !important; }
          .skill-bar-bg { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      {/* CV Document */}
      <div className="cv-root bg-white shadow-xl text-[13px] leading-relaxed" style={{ maxWidth: 900 }}>
        {/* ═══ HEADER BANNER ═══ */}
        <div className="bg-teal-700 text-white px-8 py-6 flex items-center gap-6">
          {/* Avatar */}
          <div className="relative group flex-shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
              <img
                src={avatar || DEFAULT_AVATAR}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <label className="no-print absolute inset-0 rounded-full flex items-center justify-center
                              bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs text-white font-medium">
              Đổi ảnh
              <input type="file" accept="image/*" onChange={onPickAvatar} className="hidden" />
            </label>
          </div>

          {/* Name + Position */}
          <div className="flex-grow min-w-0">
            <h1
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setData((d) => ({ ...d, personal: { ...d.personal, fullName: e.target.innerText } }))}
              className="text-3xl font-bold text-white leading-tight mb-1"
            >
              {data.personal.fullName}
            </h1>
            <div className="text-teal-200 text-base font-light">
              <Inline
                value={data.personal.position}
                onChange={(v) => setData((d) => ({ ...d, personal: { ...d.personal, position: v } }))}
                className="text-teal-100"
              />
            </div>
          </div>

          {/* Contact grid */}
          <div className="flex-shrink-0 text-sm space-y-1 text-teal-100 hidden sm:block">
            <ContactLine icon="📞" value={data.personal.phone}
              onChange={(v) => setData((d) => ({ ...d, personal: { ...d.personal, phone: v } }))} />
            <ContactLine icon="✉️" value={data.personal.email}
              onChange={(v) => setData((d) => ({ ...d, personal: { ...d.personal, email: v } }))} />
            <ContactLine icon="🌐" value={data.personal.website}
              onChange={(v) => setData((d) => ({ ...d, personal: { ...d.personal, website: v } }))} />
            <ContactLine icon="📍" value={data.personal.address}
              onChange={(v) => setData((d) => ({ ...d, personal: { ...d.personal, address: v } }))} />
          </div>
        </div>

        {/* ═══ BODY: 2-column ═══ */}
        <div className="flex">
          {/* ── LEFT SIDEBAR ── */}
          <div className="w-[220px] flex-shrink-0 bg-slate-50 border-r border-gray-200 px-4 py-5 space-y-5">

            {/* Personal info (mobile fallback + extra) */}
            <SideSection title="THÔNG TIN">
              <div className="space-y-1.5 text-xs text-gray-600">
                <SideField label="Ngày sinh" value={data.personal.dob}
                  onChange={(v) => setData((d) => ({ ...d, personal: { ...d.personal, dob: v } }))} />
                <SideField label="Giới tính" value={data.personal.gender}
                  onChange={(v) => setData((d) => ({ ...d, personal: { ...d.personal, gender: v } }))} />
              </div>
            </SideSection>

            {/* Skills */}
            <SideSection
              title="KỸ NĂNG"
              onAdd={() => addItem("skills", { name: "Kỹ năng mới", level: 50, note: "" })}
            >
              <div className="space-y-3">
                {data.skills.map((sk, i) => (
                  <div key={i} className="group/sk">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-medium text-gray-700 text-xs">
                        <Inline value={sk.name} onChange={(v) => updateItem("skills", i, "name", v)} />
                      </span>
                      <button
                        onClick={() => removeItem("skills", i)}
                        className="no-print text-red-400 text-[10px] opacity-0 group-hover/sk:opacity-100 transition-opacity"
                      >✕</button>
                    </div>
                    {/* Skill bar */}
                    <div className="skill-bar-bg h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all"
                        style={{ width: `${sk.level}%` }}
                      />
                    </div>
                    <input
                      type="range" min={10} max={100} value={sk.level}
                      onChange={(e) => updateItem("skills", i, "level", +e.target.value)}
                      className="no-print w-full h-1 mt-0.5 accent-teal-600 cursor-pointer"
                    />
                    {sk.note && (
                      <div className="text-[11px] text-gray-400">
                        <Inline value={sk.note} onChange={(v) => updateItem("skills", i, "note", v)} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SideSection>

            {/* Certificates */}
            <SideSection
              title="CHỨNG CHỈ"
              onAdd={() => addItem("certificates", { time: "2024", name: "Tên chứng chỉ", desc: "" })}
            >
              {data.certificates.map((c, i) => (
                <div key={i} className="group/c mb-2">
                  <div className="flex justify-between">
                    <span className="text-[11px] text-teal-600 font-medium">
                      <Inline value={c.time} onChange={(v) => updateItem("certificates", i, "time", v)} />
                    </span>
                    <button onClick={() => removeItem("certificates", i)}
                      className="no-print text-red-400 text-[10px] opacity-0 group-hover/c:opacity-100 transition-opacity">✕</button>
                  </div>
                  <div className="font-semibold text-xs text-gray-700">
                    <Inline value={c.name} onChange={(v) => updateItem("certificates", i, "name", v)} />
                  </div>
                  <div className="text-[11px] text-gray-500">
                    <Inline value={c.desc} onChange={(v) => updateItem("certificates", i, "desc", v)} />
                  </div>
                </div>
              ))}
            </SideSection>

            {/* Awards */}
            <SideSection
              title="GIẢI THƯỞNG"
              onAdd={() => addItem("awards", { time: "2024", name: "Tên giải thưởng", desc: "" })}
            >
              {data.awards.map((a, i) => (
                <div key={i} className="group/a mb-2">
                  <div className="flex justify-between">
                    <span className="text-[11px] text-teal-600 font-medium">
                      <Inline value={a.time} onChange={(v) => updateItem("awards", i, "time", v)} />
                    </span>
                    <button onClick={() => removeItem("awards", i)}
                      className="no-print text-red-400 text-[10px] opacity-0 group-hover/a:opacity-100 transition-opacity">✕</button>
                  </div>
                  <div className="font-semibold text-xs text-gray-700">
                    <Inline value={a.name} onChange={(v) => updateItem("awards", i, "name", v)} />
                  </div>
                  <div className="text-[11px] text-gray-500">
                    <Inline value={a.desc} onChange={(v) => updateItem("awards", i, "desc", v)} />
                  </div>
                </div>
              ))}
            </SideSection>

            {/* Hobbies */}
            <SideSection title="SỞ THÍCH">
              <div className="text-xs text-gray-600 leading-relaxed">
                <EditableParagraph value={data.hobbies} onChange={(v) => setData((d) => ({ ...d, hobbies: v }))} />
              </div>
            </SideSection>
          </div>

          {/* ── RIGHT MAIN ── */}
          <div className="flex-grow px-6 py-5 space-y-5">

            {/* Objective */}
            <MainSection title="MỤC TIÊU NGHỀ NGHIỆP">
              <div className="text-gray-600 text-[13px] leading-relaxed">
                <EditableParagraph value={data.objective} onChange={(v) => setData((d) => ({ ...d, objective: v }))} />
              </div>
            </MainSection>

            {/* Experience */}
            <MainSection
              title="KINH NGHIỆM LÀM VIỆC"
              onAdd={() => addItem("experiences", { time: "20XX – 20XX", company: "Tên công ty", role: "Vị trí", desc: "" })}
            >
              {data.experiences.map((ex, i) => (
                <TimelineItem
                  key={i}
                  time={ex.time} onTimeChange={(v) => updateItem("experiences", i, "time", v)}
                  title={ex.company} onTitleChange={(v) => updateItem("experiences", i, "company", v)}
                  sub={ex.role} onSubChange={(v) => updateItem("experiences", i, "role", v)}
                  desc={ex.desc} onDescChange={(v) => updateItem("experiences", i, "desc", v)}
                  onRemove={() => removeItem("experiences", i)}
                />
              ))}
            </MainSection>

            {/* Education */}
            <MainSection
              title="HỌC VẤN"
              onAdd={() => addItem("educations", { time: "20XX – 20XX", school: "Tên trường", degree: "Ngành học", desc: "" })}
            >
              {data.educations.map((ed, i) => (
                <TimelineItem
                  key={i}
                  time={ed.time} onTimeChange={(v) => updateItem("educations", i, "time", v)}
                  title={ed.school} onTitleChange={(v) => updateItem("educations", i, "school", v)}
                  sub={ed.degree} onSubChange={(v) => updateItem("educations", i, "degree", v)}
                  desc={ed.desc} onDescChange={(v) => updateItem("educations", i, "desc", v)}
                  onRemove={() => removeItem("educations", i)}
                />
              ))}
            </MainSection>

            {/* Activities */}
            <MainSection
              title="HOẠT ĐỘNG"
              onAdd={() => addItem("activities", { time: "20XX – 20XX", org: "Tên tổ chức", role: "Vị trí", desc: "" })}
            >
              {data.activities.map((ac, i) => (
                <TimelineItem
                  key={i}
                  time={ac.time} onTimeChange={(v) => updateItem("activities", i, "time", v)}
                  title={ac.org} onTitleChange={(v) => updateItem("activities", i, "org", v)}
                  sub={ac.role} onSubChange={(v) => updateItem("activities", i, "role", v)}
                  desc={ac.desc} onDescChange={(v) => updateItem("activities", i, "desc", v)}
                  onRemove={() => removeItem("activities", i)}
                />
              ))}
            </MainSection>

            {/* References */}
            <MainSection
              title="NGƯỜI GIỚI THIỆU"
              onAdd={() => addItem("references", { name: "Tên người tham chiếu", phone: "0123 456 789", email: "ref@email.com", note: "Chức vụ" })}
            >
              <div className="grid grid-cols-2 gap-4">
                {data.references.map((ref, i) => (
                  <div key={i} className="group/ref border border-gray-100 rounded-lg p-3 bg-slate-50/50">
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-gray-800">
                        <Inline value={ref.name} onChange={(v) => updateItem("references", i, "name", v)} />
                      </div>
                      <button onClick={() => removeItem("references", i)}
                        className="no-print text-red-400 text-[10px] opacity-0 group-hover/ref:opacity-100 transition-opacity">✕</button>
                    </div>
                    <div className="text-xs text-teal-600 mt-0.5">
                      <Inline value={ref.note} onChange={(v) => updateItem("references", i, "note", v)} />
                    </div>
                    <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                      <div>📞 <Inline value={ref.phone} onChange={(v) => updateItem("references", i, "phone", v)} /></div>
                      <div>✉️ <Inline value={ref.email} onChange={(v) => updateItem("references", i, "email", v)} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </MainSection>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ SUB-COMPONENTS ═══ */

function Inline({ value, onChange, className = "" }) {
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange?.(e.currentTarget.innerText)}
      className={`outline-none border-b border-dotted border-transparent hover:border-teal-300 focus:border-teal-500 transition-colors ${className}`}
    >
      {value}
    </span>
  );
}

function EditableParagraph({ value, onChange }) {
  return (
    <div
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange?.(e.currentTarget.innerText)}
      className="outline-none whitespace-pre-wrap cursor-text"
    >
      {value}
    </div>
  );
}

function ContactLine({ icon, value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs">{icon}</span>
      <Inline value={value} onChange={onChange} className="text-teal-100 text-xs" />
    </div>
  );
}

function SideField({ label, value, onChange }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">{label}</div>
      <Inline value={value} onChange={onChange} className="text-gray-700" />
    </div>
  );
}

function SideSection({ title, children, onAdd }) {
  return (
    <div className="group/sec">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-4 rounded-full bg-teal-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-teal-700">{title}</span>
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="no-print text-[10px] px-1.5 py-0.5 rounded bg-teal-100 text-teal-700
                       opacity-0 group-hover/sec:opacity-100 transition-opacity hover:bg-teal-200"
          >
            + Thêm
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function MainSection({ title, children, onAdd }) {
  return (
    <div className="group/main">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-teal-500" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-teal-700">{title}</span>
          <div className="flex-grow h-px bg-gray-200 ml-1 w-16" />
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="no-print text-xs px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-600
                       opacity-0 group-hover/main:opacity-100 transition-opacity hover:bg-teal-100"
          >
            + Thêm
          </button>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function TimelineItem({ time, onTimeChange, title, onTitleChange, sub, onSubChange, desc, onDescChange, onRemove }) {
  return (
    <div className="group/item flex gap-3">
      {/* Timeline dot */}
      <div className="flex flex-col items-center flex-shrink-0 pt-1">
        <div className="w-2 h-2 rounded-full bg-teal-500 ring-2 ring-teal-100" />
        <div className="w-px flex-grow bg-gray-200 mt-1" />
      </div>

      <div className="flex-grow pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-grow">
            <div className="font-semibold text-gray-800 text-[13px]">
              <Inline value={title} onChange={onTitleChange} />
            </div>
            <div className="text-xs text-teal-600 font-medium mt-0.5">
              <Inline value={sub} onChange={onSubChange} />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
              <Inline value={time} onChange={onTimeChange} />
            </span>
            <button
              onClick={onRemove}
              className="no-print text-red-400 text-[10px] opacity-0 group-hover/item:opacity-100 transition-opacity"
            >✕</button>
          </div>
        </div>
        {desc !== undefined && (
          <div className="text-xs text-gray-500 mt-1 leading-relaxed">
            <EditableParagraph value={desc} onChange={onDescChange} />
          </div>
        )}
      </div>
    </div>
  );
}