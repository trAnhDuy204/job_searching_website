import { memo, useState } from "react";
import { BiSearchAlt, BiSolidHome } from "react-icons/bi";
import { BsVectorPen, BsFillBarChartLineFill, BsFillDoorOpenFill, BsFillPersonLinesFill } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import NotificationBell from "../../../../component/notificationBell";

const navLinks = [
  { icon: BiSolidHome, label: "Trang chủ", to: "/trang-ung-vien" },
  { icon: BiSearchAlt, label: "Tìm việc làm", to: "/trang-tim-viec" },
  { icon: BsVectorPen, label: "Tạo CV", to: "/trang-tao-cv" },
  {
    icon: BsFillBarChartLineFill,
    label: "Phân tích lương",
    href: "https://drive.google.com/file/d/1aOtlv8rOT_VKtgQTetG6POR98y-Xnpkc/view?usp=drive_link",
    external: true,
  },
];

const EmployeeHeader = ({ user: userProp }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  let user = userProp;
  if (!user) {
    try {
      const stored = localStorage.getItem("user_ungvien");
      user = stored ? JSON.parse(stored) : null;
    } catch {
      user = null;
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token_ungvien");
    localStorage.removeItem("user_ungvien");
    navigate("/");
  };

  const isActive = (to) => location.pathname === to;

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a] shadow-lg shadow-black/30 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* ── Logo ── */}
        <Link
          to="/trang-ung-vien"
          className="flex items-center gap-2 flex-shrink-0 group"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-transform">
            J
          </span>
          <span className="text-xl font-black tracking-tight text-white">
            job<span className="text-cyan-400">Verse</span>
          </span>
        </Link>

        {/* ── Nav chính (desktop) ── */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ icon: Icon, label, to, href, external }) => {
            const active = to && isActive(to);
            const base =
              "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ";
            const cls = active
              ? base + "bg-teal-600/20 text-teal-300"
              : base + "text-slate-300 hover:bg-white/8 hover:text-white";

            if (external) {
              return (
                <a key={label} href={href} target="_blank" rel="noreferrer" className={cls}>
                  <Icon className="text-base flex-shrink-0" />
                  {label}
                </a>
              );
            }
            return (
              <Link key={label} to={to} className={cls}>
                <Icon className="text-base flex-shrink-0" />
                {label}
                {active && <span className="ml-0.5 w-1 h-1 rounded-full bg-teal-400 inline-block" />}
              </Link>
            );
          })}
        </nav>

        {/* ── Right side ── */}
        <div className="hidden md:flex items-center gap-2">
          {/* Notification */}
          {user && (
            <div className="flex items-center">
              <NotificationBell userId={user.id} token={user.token} />
            </div>
          )}

          {/* Account */}
          <Link
            to="/ho-so-ung-vien"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/8 hover:text-white transition-all"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-7 h-7 rounded-full object-cover border border-white/20"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user?.name?.[0]?.toUpperCase() || <BsFillPersonLinesFill />}
              </div>
            )}
            <span className="max-w-[96px] truncate">
              {user?.name || "Tài khoản"}
            </span>
          </Link>

          {/* Divider */}
          <div className="w-px h-5 bg-white/10" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/15 hover:text-red-400 transition-all"
          >
            <BsFillDoorOpenFill className="text-base" />
            Đăng xuất
          </button>
        </div>

        {/* ── Hamburger (mobile) ── */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 p-1"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 bg-slate-300 rounded transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block h-0.5 bg-slate-300 rounded transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 bg-slate-300 rounded transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0f172a] border-t border-white/5 px-4 pb-4 pt-2 flex flex-col gap-1">
          {navLinks.map(({ icon: Icon, label, to, href, external }) => {
            const active = to && isActive(to);
            const base = "flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ";
            const cls = active
              ? base + "bg-teal-600/20 text-teal-300"
              : base + "text-slate-300 hover:bg-white/8 hover:text-white";

            if (external) {
              return (
                <a key={label} href={href} target="_blank" rel="noreferrer" className={cls}>
                  <Icon className="text-base" /> {label}
                </a>
              );
            }
            return (
              <Link key={label} to={to} className={cls} onClick={() => setMobileOpen(false)}>
                <Icon className="text-base" /> {label}
              </Link>
            );
          })}

          <div className="h-px bg-white/8 my-1" />

          <Link
            to="/ho-so-ung-vien"
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/8 hover:text-white transition-all"
            onClick={() => setMobileOpen(false)}
          >
            <BsFillPersonLinesFill className="text-base" />
            Tài khoản
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/15 hover:text-red-400 transition-all w-full text-left"
          >
            <BsFillDoorOpenFill className="text-base" />
            Đăng xuất
          </button>
        </div>
      )}
    </header>
  );
};

export default memo(EmployeeHeader);