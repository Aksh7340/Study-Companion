import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

/* Hamburger icon */
function HamburgerIcon({ open }) {
  return (
    <div className="w-5 h-4 flex flex-col justify-between">
      <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
      <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${open ? "opacity-0" : ""}`} />
      <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${open ? "-rotate-45 -translate-y-[9px]" : ""}`} />
    </div>
  );
}

export default function Navbar({ onMenuToggle, mobileOpen, showSidebar = false, sidebarCollapsed = false }) {

  const navigate  = useNavigate();
  const location  = useLocation();
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    function checkToken() { setToken(localStorage.getItem("token")); }
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  const isPublicPage = ["/", "/auth"].includes(location.pathname);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  }

  /*
   * =========================================
   * FIX: NAVBAR TEXT BLEEDING OVERLAP
   * =========================================
   * Previously, the "Study Companion" logo text was bleeding from behind the 
   * sidebar when it collapsed. We discovered this text was actually coming from 
   * the Navbar, not the sidebar! 
   * 
   * The sidebar correctly hid its text, but the Navbar's logo text sat right behind it.
   * To fix this, we:
   * 1. Compute `navbarLeftPad` based on the sidebar's current width.
   * 2. Apply it via a `<style>` block (lines below) to push the navbar content right.
   * 3. Conditionally hiding the Navbar's logo entirely on desktop when the sidebar 
   *    is visible (since the sidebar has its own logo).
   */
  const navbarLeftPad = showSidebar
    ? (sidebarCollapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-width)")
    : "0";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-30 h-[60px] glass border-b border-white/50 flex items-center"
      style={{ boxShadow: "0 1px 12px rgba(99,102,241,0.07)" }}
    >
      {/* Responsive padding: on mobile always px-4, on desktop shift right past sidebar */}
      <div
        className="w-full flex items-center justify-between px-4 sm:px-6 transition-all duration-300"
        style={{ paddingLeft: undefined }}
      >
        {/* On desktop when sidebar present, add left padding to avoid overlap */}
        <style>{`
          @media (min-width: 768px) {
            .navbar-inner { padding-left: ${navbarLeftPad} !important; }
          }
        `}</style>

        {/* Left – hamburger (mobile, authenticated) + logo */}
        <div className="flex items-center gap-3 navbar-inner">
          {/* Hamburger — only on mobile when authenticated */}
          {token && !isPublicPage && (
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              aria-label="Toggle sidebar"
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          )}

          {/*
           * Logo — ONLY show on:
           * 1. Public pages (no sidebar)
           * 2. Mobile (sidebar is a drawer, not persistent)
           * 3. When there's no sidebar at all
           * HIDE on desktop when sidebar is visible (sidebar has its own logo)
           */}
          {!showSidebar ? (
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 group"
            >
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xs">SC</span>
              </div>
              <span className="font-bold text-slate-800 text-base hidden sm:block group-hover:text-indigo-600 transition-colors">
                Study Companion
              </span>
            </button>
          ) : (
            /* On mobile when sidebar is present but hidden, show compact logo */
            <button
              onClick={() => navigate("/")}
              className="md:hidden flex items-center gap-2 group"
            >
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xs">SC</span>
              </div>
              <span className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                Study Companion
              </span>
            </button>
          )}
        </div>

        {/* Right – auth actions */}
        <div className="flex items-center gap-2">

          {isPublicPage && (
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"}`
              }
            >
              Home
            </NavLink>
          )}

          {!token ? (
            <NavLink
              to="/auth"
              className="btn-primary text-xs px-4 py-2"
            >
              Login / Sign Up
            </NavLink>
          ) : isPublicPage ? (
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all shadow-sm"
            >
              Logout
            </button>
          ) : null}

        </div>
      </div>
    </nav>
  );
}