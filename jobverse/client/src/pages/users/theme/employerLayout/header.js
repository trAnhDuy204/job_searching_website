import { memo, useState, useEffect } from "react";
import { axiosClient } from "../../../../JWT/axiosClient";
import { BiSolidHome } from "react-icons/bi";
import { BsVectorPen, BsFillBarChartLineFill, BsFillDoorOpenFill, BsFillPersonLinesFill } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import NotificationBell from "../../../../component/notificationBell";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const EmployerHeader = ({ user: userProp }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  let user = userProp;
  if (!user) {
    try {
      const stored = localStorage.getItem("user_nhatuyendung");
      user = stored ? JSON.parse(stored) : null;
    } catch {
      user = null;
    }
  }

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axiosClient.get("/api/company/me");
        setCompany(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy hồ sơ công ty:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token_nhatuyendung");
    localStorage.removeItem("user_nhatuyendung");
    navigate("/");
  };

  const isActive = (to) => location.pathname === to;

  const navLinks = [
    { icon: BiSolidHome, label: "Trang chủ", to: "/trang-nha-tuyen-dung" },
    { icon: BsVectorPen, label: "Đăng tin tuyển dụng", to: "/dang-tin-tuyen-dung" },
    ...(company
      ? [{ icon: BsFillBarChartLineFill, label: "Trang công ty", to: `/trang-cong-ty/${company.id}` }]
      : []),
  ];

  // Loading skeleton
  if (loading) {
    return (
      <header className="sticky top-0 z-50 bg-[#0f172a] border-b border-white/5">
        <div className="h-1 w-full bg-gradient-to-r from-teal-600 via-cyan-400 to-teal-600" />
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <div className="w-32 h-7 rounded-lg bg-white/10 animate-pulse" />
          <div className="hidden md:flex gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-24 h-7 rounded-lg bg-white/10 animate-pulse" />
            ))}
          </div>
          <div className="w-24 h-7 rounded-lg bg-white/10 animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a] shadow-lg shadow-black/30 border-b border-white/5">
      <div className="h-1 w-full bg-gradient-to-r from-teal-600 via-cyan-400 to-teal-600" />

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* ── Logo ── */}
        <Link to="/trang-nha-tuyen-dung" className="flex items-center gap-2 flex-shrink-0 group">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-transform">
            J
          </span>
          <span className="text-xl font-black tracking-tight text-white">
            job<span className="text-teal-400">Verse</span>
          </span>
        </Link>

        {/* ── Badge NTD ── */}
        <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-300 text-xs font-semibold flex-shrink-0">
          Nhà tuyển dụng
        </span>

        {/* ── Nav chính ── */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map(({ icon: Icon, label, to }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150
                  ${active
                    ? "bg-teal-600/20 text-teal-300"
                    : "text-slate-300 hover:bg-white/8 hover:text-white"
                  }`}
              >
                <Icon className="text-base flex-shrink-0" />
                {label}
                {active && <span className="ml-0.5 w-1 h-1 rounded-full bg-teal-400 inline-block" />}
              </Link>
            );
          })}
        </nav>

        {/* ── Right side ── */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">

          {/* Company logo + name */}
          {company && (
            <Link
              to={`/trang-cong-ty/${company.id}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/8 transition-all group"
            >
              <img
                src={company.logo_url ? `${company.logo_url}` : `${API_URL}/uploads/default/logo_company_default.jpg`}
                alt={company.company_name}
                className="w-7 h-7 rounded-md object-contain border border-white/15 bg-white/5"
                onError={e => { e.target.src = `${API_URL}/uploads/default/logo_company_default.jpg`; }}
              />
              <span className="text-sm font-medium text-slate-300 group-hover:text-white max-w-[120px] truncate transition-colors">
                {company.company_name}
              </span>
            </Link>
          )}

          <div className="w-px h-5 bg-white/10" />

          {/* Notification */}
          {user && (
            <div className="flex items-center">
              <NotificationBell userId={user.id} token={user.token} />
            </div>
          )}

          {/* Account */}
          <Link
            to="/ho-so-nha-tuyen-dung"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/8 hover:text-white transition-all"
          >
            <BsFillPersonLinesFill className="text-base" />
            Tài khoản
          </Link>

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

        {/* ── Hamburger ── */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 p-1"
          onClick={() => setMobileOpen(v => !v)}
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

          {/* Company card on mobile */}
          {company && (
            <div className="flex items-center gap-3 px-4 py-3 mb-1 rounded-xl bg-white/5 border border-white/8">
              <img
                src={company.logo_url || `${API_URL}/uploads/default/logo_company_default.jpg`}
                alt={company.company_name}
                className="w-9 h-9 rounded-lg object-contain bg-white/10 border border-white/10"
                onError={e => { e.target.src = `${API_URL}/uploads/default/logo_company_default.jpg`; }}
              />
              <div>
                <div className="text-sm font-semibold text-white">{company.company_name}</div>
                <div className="text-xs text-amber-300 font-medium">Nhà tuyển dụng</div>
              </div>
            </div>
          )}

          {navLinks.map(({ icon: Icon, label, to }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${active ? "bg-teal-600/20 text-teal-300" : "text-slate-300 hover:bg-white/8 hover:text-white"}`}
              >
                <Icon className="text-base" /> {label}
              </Link>
            );
          })}

          <div className="h-px bg-white/8 my-1" />

          <Link
            to="/ho-so-nha-tuyen-dung"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/8 hover:text-white transition-all"
          >
            <BsFillPersonLinesFill className="text-base" /> Tài khoản
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/15 hover:text-red-400 transition-all w-full text-left"
          >
            <BsFillDoorOpenFill className="text-base" /> Đăng xuất
          </button>
        </div>
      )}
    </header>
  );
};

export default memo(EmployerHeader);