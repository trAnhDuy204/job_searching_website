import { memo, useState } from "react";
import { BsVectorPen, BsFillBarChartLineFill } from "react-icons/bs";
import { BiSearchAlt, BiSolidHome } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import React from "react";

const navLinks = [
  { icon: BiSolidHome, label: "Trang chủ", to: "/" },
  { icon: BiSearchAlt, label: "Tìm việc làm", to: "/trang-chu-tim-viec" },
  { icon: BsVectorPen, label: "Tạo CV", to: "/trang-chu-tao-cv" },
  { icon: BsFillBarChartLineFill, label: "Phân tích lương", to: "" },
];

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to) => to && location.pathname === to;

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a] shadow-lg shadow-black/30 border-b border-white/5">
      <div className="h-1 w-full bg-gradient-to-r from-teal-600 via-cyan-400 to-teal-600" />

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-transform">
            J
          </span>
          <span className="text-xl font-black tracking-tight text-white">
            job<span className="text-teal-400">Verse</span>
          </span>
        </Link>

        {/* ── Nav ── */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map(({ icon: Icon, label, to }) => {
            const active = isActive(to);
            return (
              <Link
                key={label}
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

        {/* ── Auth buttons ── */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <Link
            to="/dang-ky"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 border border-white/10 hover:bg-white/8 hover:text-white transition-all"
          >
            Đăng ký
          </Link>
          <Link
            to="/dang-nhap"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition-all shadow-md shadow-blue-900/40"
          >
            Đăng nhập
          </Link>
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
          {navLinks.map(({ icon: Icon, label, to }) => {
            const active = isActive(to);
            return (
              <Link
                key={label}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${active ? "bg-teal-600/20 text-teal-300" : "text-slate-300 hover:bg-white/8 hover:text-white"}`}
              >
                <Icon className="text-base" /> {label}
              </Link>
            );
          })}

          <div className="h-px bg-white/8 my-2" />

          <Link
            to="/dang-ky"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 border border-white/10 hover:bg-white/8 hover:text-white transition-all"
          >
            Đăng ký
          </Link>
          <Link
            to="/dang-nhap"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-cyan-400 transition-all mt-1"
          >
            Đăng nhập
          </Link>
        </div>
      )}
    </header>
  );
};

export default memo(Header);