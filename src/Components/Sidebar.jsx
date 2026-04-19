import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { getExamStatus, getExamProgress } from "../Logic/studyPlanner";

/* ── Inline SVG Icon ─────────────────────────────────────────────────── */
const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  setup: "M12 5v14M5 12h14",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  chevronL: "M15 18l-6-6 6-6",
  chevronR: "M9 18l6-6-6-6",
  close: "M18 6L6 18M6 6l12 12",
  total: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  completed: "M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3",
  active: "M13 10V3L4 14h7v7l9-11h-7z",
  urgent: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  subjects: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  progress: "M18 20V10 M12 20V4 M6 20v-6",
};

/* ── Quick Stats ─────────────────────────────────────────────────────── */
function buildStats(examData, subjects) {
  const total = examData.length;
  const completed = examData.filter(e => getExamStatus(e, subjects) === "Completed").length;
  const urgent = examData.filter(e => getExamStatus(e, subjects) === "Urgent").length;
  const active = examData.filter(e => {
    const s = getExamStatus(e, subjects);
    return ["In Progress", "Upcoming", "Urgent", "Ready"].includes(s);
  }).length;
  const totalSubs = subjects.length;
  let avgProgress = 0;
  if (total > 0) {
    avgProgress = Math.round(
      examData.reduce((sum, e) => sum + getExamProgress(e._id, subjects), 0) / total
    );
  }
  return [
    { label: "Total", value: total, icon: icons.total, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
    { label: "Done", value: completed, icon: icons.completed, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "Active", value: active, icon: icons.active, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { label: "Urgent", value: urgent, icon: icons.urgent, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
    { label: "Subjects", value: totalSubs, icon: icons.subjects, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
    { label: "Progress", value: `${avgProgress}%`, icon: icons.progress, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  ];
}

/* ── NavItem ─────────────────────────────────────────────────────────── */
function NavItem({ to, iconPath, label, collapsed }) {
  return (
    <NavLink
      to={to}
      title={label}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl text-sm font-semibold transition-all duration-200
        ${collapsed ? "justify-center w-10 h-10 mx-auto" : "px-3 py-2.5"}
        ${isActive
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
          : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"}`
      }
    >
      <span className="flex-shrink-0 flex items-center justify-center">
        <Icon d={iconPath} size={18} />
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}

/* ── Main Sidebar Component ─────────────────────────────────────────── */
export default function Sidebar({ examData = [], subjects = [], mobileOpen, onMobileClose, collapsed = false, onCollapseChange }) {
  const setCollapsed = (val) => {
    if (onCollapseChange) {
      const next = typeof val === "function" ? val(collapsed) : val;
      onCollapseChange(next);
    }
  };
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const hiddenPaths = ["/", "/auth"];
  if (!token || hiddenPaths.includes(location.pathname)) return null;

  const stats = buildStats(examData, subjects);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  }

  /* ── Inner content (shared between desktop + mobile) ─────────────── */
  const SidebarInner = ({ isMobile = false }) => {
    const isCollapsed = collapsed && !isMobile;
    return (
      <div className="flex flex-col h-full overflow-hidden">

        {/* ── Logo row ── */}
        <div className={`flex items-center border-b border-slate-100 flex-shrink-0
          ${isCollapsed ? "pl-3 py-4" : "gap-3 px-4 py-4"}`}>
          <div className={`${isCollapsed ? "w-6 h-6" : "w-8 h-8"} rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-200`}>
            <span className={`text-white font-extrabold leading-none ${isCollapsed ? "text-[10px]" : "text-xs"}`}>SC</span>
          </div>
          {!isCollapsed && (
            <span className="font-bold text-slate-800  text-sm leading-tight truncate text-gray-900  ">
              Study Companion
            </span>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className={`flex flex-col gap-1 py-3 flex-shrink-0 ${isCollapsed ? "px-1" : "px-3"}`}>
          {!isCollapsed && (
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">
              Menu
            </p>
          )}
          <NavItem to="/dashboard" iconPath={icons.dashboard} label="Dashboard" collapsed={isCollapsed} />
          <NavItem to="/setup" iconPath={icons.setup} label="Setup" collapsed={isCollapsed} />
        </nav>

        {/* ── Quick Stats ── */}
        {examData.length > 0 && (
          <div className={`border-t border-slate-100 flex-shrink-0 ${isCollapsed ? "px-1 py-3" : "px-3 py-3"}`}>
            {!isCollapsed && (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-2">
                Quick Stats
              </p>
            )}

            {isCollapsed ? (
              /* Icon-only stats */
              <div className="flex flex-col items-center gap-2">
                {stats.map(stat => (
                  <div
                    key={stat.label}
                    title={`${stat.label}: ${stat.value}`}
                    className={`w-10 h-10 rounded-xl border ${stat.bg} ${stat.border} ${stat.color}
                      flex items-center justify-center cursor-default`}
                  >
                    <Icon d={stat.icon} size={16} />
                  </div>
                ))}
              </div>
            ) : (
              /* 2-col grid stats */
              <div className="grid grid-cols-2 gap-1.5">
                {stats.map(stat => (
                  <div
                    key={stat.label}
                    className={`${stat.bg} border ${stat.border} rounded-xl p-2 animate-fade-in`}
                  >
                    <div className={`${stat.color} mb-0.5`}>
                      <Icon d={stat.icon} size={14} />
                    </div>
                    <p className="text-base font-bold text-slate-800 leading-none">{stat.value}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1 min-h-0" />

        {/* ── Logout ── */}
        <div className={`border-t border-slate-100 flex-shrink-0 py-3 ${isCollapsed ? "px-1" : "px-3"}`}>
          <button
            onClick={handleLogout}
            title="Logout"
            className={`flex items-center gap-3 rounded-xl text-sm font-semibold text-red-500
              hover:bg-red-50 transition-all duration-200
              ${isCollapsed ? "w-10 h-10 mx-auto justify-center" : "w-full px-3 py-2.5"}`}
          >
            <span className="flex-shrink-0 flex items-center justify-center">
              <Icon d={icons.logout} size={18} />
            </span>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ══════════════ DESKTOP SIDEBAR ══════════════ */}
      <aside
        style={{ width: collapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-width)" }}
        className="hidden md:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-slate-100
          shadow-sm transition-all duration-300 z-40"
      >
        {/* 
         * =========================================
         * FIX: SIDEBAR COLLAPSE TOGGLE BUTTON 
         * =========================================
         * Previously, this button was positioned at `-right-3` (outside the sidebar).
         * Because the sidebar had `overflow-hidden`, the button was getting clipped
         * and became completely unclickable.
         * 
         * Now, the button is placed at `right-2` (inside the sidebar bounds), and 
         * the `overflow-hidden` rule has been moved to an inner wrapper (`div` below).
         */}
        <button
          onClick={() => setCollapsed(c => !c)}
          aria-label="Toggle sidebar"
          className="absolute top-[18px] right-2 w-6 h-6 bg-slate-100 border border-slate-200 rounded-full
            flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300
            transition-all duration-200 z-50"
        >
          <Icon d={collapsed ? icons.chevronR : icons.chevronL} size={12} />
        </button>

        <div className="overflow-hidden h-full">
          <SidebarInner />
        </div>
      </aside>

      {/* ══════════════ MOBILE OVERLAY ══════════════ */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onMobileClose}
        />
      )}

      {/* ══════════════ MOBILE DRAWER ══════════════ */}
      <aside
        style={{ width: "var(--sidebar-width)" }}
        className={`md:hidden fixed left-0 top-0 h-screen bg-white border-r border-slate-100 shadow-xl
          transition-transform duration-300 z-50 overflow-y-auto
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          onClick={onMobileClose}
          aria-label="Close menu"
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center
            rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-500 transition"
        >
          <Icon d={icons.close} size={14} />
        </button>
        <SidebarInner isMobile />
      </aside>
    </>
  );
}
