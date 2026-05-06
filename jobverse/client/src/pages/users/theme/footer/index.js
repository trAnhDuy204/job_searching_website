import { memo } from "react";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube, FaPhone, FaBuilding  } from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";
import { Link } from "react-router-dom";

const socials = [
  { icon: FaFacebook, href: "https://www.facebook.com/Rinz99", label: "Facebook" },
  { icon: FaInstagram, href: "https://www.instagram.com/tr_duy9.9/", label: "Instagram" },
  { icon: FaTiktok, href: "https://www.tiktok.com/@trhaduy.04", label: "TikTok" },
  { icon: FaYoutube, href: "https://www.youtube.com/channel/UCrboJ6wjmDp8QpdS87VWxhw", label: "YouTube" },
];

const infoLinks = [
  { label: "Điều khoản sử dụng", to: "" },
  { label: "Quy định sử dụng", to: "" },
  { label: "Chính sách dữ liệu cá nhân", to: "" },
  { label: "Tuân thủ và sự đồng ý của khách hàng", to: "" },
];

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white border-t border-white/5">
      
      {/* Top wave decoration */}
      <div className="h-1 w-full bg-gradient-to-r from-teal-600 via-cyan-400 to-blue-600" />

      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* ── Cột 1: Brand ── */}
          <div className="space-y-5">
            {/* Logo */}
            <Link className="flex items-center gap-2 group w-fit">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white font-black text-base shadow-lg group-hover:scale-105 transition-transform">
                J
              </span>
              <span className="text-2xl font-black tracking-tight">
                job<span className="text-teal-400">Verse</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed">
              Nền tảng tuyển dụng kết nối ứng viên tài năng với nhà tuyển dụng hàng đầu Việt Nam.
            </p>

            {/* Contact info */}
            <ul className="space-y-2.5 text-sm text-slate-400">
              {[
                { icon: <FaBuilding />, text: "Phòng 202, Tòa nhà DP-35, Dragon Parc 2, Nguyễn Hữu Thọ, Nhà Bè, TP.HCM" },
                { icon: <FaPhone />, text: "(082) 3069 390" },
                { icon: <MdOutlineMail />, text: "tranhduydl@gmail.com" },
                { icon: <MdOutlineMail />, text: "anhduy99204@gmail.com" },
              ].map(({ icon, text }, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Cột 2: Thông tin ── */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500">
              Thông tin
            </h4>
            <ul className="space-y-1">
              {infoLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="group flex items-center gap-2 text-sm text-slate-400 hover:text-white py-1.5 transition-colors duration-150"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-cyan-400 transition-colors flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Cột 3: Kết nối ── */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500">
              Kết nối với chúng tôi
            </h4>

            <p className="text-sm text-slate-400 leading-relaxed">
              Theo dõi jobVerse trên các nền tảng mạng xã hội để cập nhật tin tức mới nhất.
            </p>

            <div className="flex gap-3 pt-1">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-slate-400 hover:bg-blue-600/20 hover:border-blue-500/40 hover:text-blue-300 transition-all duration-200 text-lg hover:scale-110"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-10 pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <span>
            © {new Date().getFullYear()} <span className="text-slate-400 font-medium">jobVerse</span>. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);