import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LoginContext } from "./ContextProvider";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export default function NavBar() {
  const { login, user, logout } = useContext(LoginContext);
  const [usr, setUsr] = useState(user == null ? null : jwtDecode(user));
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    toast.info("Logged Out");
    logout();
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (user) {
      setUsr(jwtDecode(user));
    }
  }, [login, user]);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Check if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
          ${isScrolled
            ? "bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-xl shadow-purple-500/5 border-b border-purple-100/50 dark:border-purple-900/30"
            : "bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900"
          }`}
      >
        {/* Animated gradient border */}
        <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent transition-opacity duration-300 ${isScrolled ? 'opacity-30' : 'opacity-60'}`} />

        {/* Floating particles effect (subtle) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-2 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse ${isScrolled ? 'opacity-20' : 'opacity-40'}`} />
          <div className={`absolute top-4 right-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse delay-300 ${isScrolled ? 'opacity-20' : 'opacity-40'}`} />
          <div className={`absolute bottom-3 left-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-700 ${isScrolled ? 'opacity-20' : 'opacity-40'}`} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo Section */}
            <Link
              to="/"
              className="group flex items-center space-x-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {/* Animated Logo Icon */}
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-purple-500/50">
                  <svg
                    className="w-6 h-6 md:w-7 md:h-7 text-white transform group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                {/* Ring effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-30 blur transition-all duration-300" />
              </div>

              {/* Brand Name */}
              <div className="flex flex-col">
                <span className={`text-lg md:text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:via-pink-300 group-hover:to-cyan-300 transition-all duration-300
                  ${isScrolled ? "" : "drop-shadow-lg"}`}>
                  AI Powered Placement Hub
                </span>
                <span className={`text-[10px] md:text-xs font-medium tracking-wider uppercase
                  ${isScrolled ? "text-purple-500/70 dark:text-purple-400/70" : "text-purple-300/70"}`}>
                  Your Career Partner
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {login === false ? (
                <>
                  <NavLink to="/" isActive={isActive("/")} isScrolled={isScrolled}>
                    <HomeIcon />
                    <span>Home</span>
                  </NavLink>

                  <NavLink to="/login" isActive={isActive("/login")} isScrolled={isScrolled} isSpecial>
                    <LoginIcon />
                    <span>Login</span>
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/" isActive={isActive("/")} isScrolled={isScrolled}>
                    <HomeIcon />
                    <span>Home</span>
                  </NavLink>

                  <NavLink to="/profile" isActive={isActive("/profile")} isScrolled={isScrolled}>
                    <ProfileIcon />
                    <span>Profile</span>
                  </NavLink>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className={`group relative flex items-center space-x-2 px-5 py-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 active:scale-95
                      ${isScrolled
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
                        : "bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/40 hover:shadow-red-400/60 border border-red-400/30"
                      }`}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
                      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>

                    <LogoutIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-95
                ${isScrolled
                  ? "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-800 text-purple-600 dark:text-purple-400 shadow-md"
                  : "bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm"
                }
                ${isMobileMenuOpen ? "ring-2 ring-purple-400/50" : ""}`}
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`h-0.5 rounded-full bg-current transform transition-all duration-300 origin-center ${isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
                <span className={`h-0.5 rounded-full bg-current transition-all duration-300 ${isMobileMenuOpen ? "opacity-0 scale-0" : ""}`} />
                <span className={`h-0.5 rounded-full bg-current transform transition-all duration-300 origin-center ${isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out
          ${isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className={`px-4 py-6 space-y-3 border-t
            ${isScrolled
              ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-purple-100 dark:border-purple-900/30"
              : "bg-slate-900/98 backdrop-blur-xl border-white/10"
            }`}>

            {login === false ? (
              <>
                <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)} isScrolled={isScrolled} isActive={isActive("/")}>
                  <HomeIcon />
                  <span>Home</span>
                </MobileNavLink>

                <MobileNavLink to="/login" onClick={() => setIsMobileMenuOpen(false)} isScrolled={isScrolled} isSpecial>
                  <LoginIcon />
                  <span>Login</span>
                </MobileNavLink>
              </>
            ) : (
              <>
                {/* User Badge Mobile */}
                {usr && (
                  <div className={`flex items-center space-x-4 p-4 rounded-2xl mb-4 border
                    ${isScrolled
                      ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-800 border-purple-100 dark:border-purple-800/30"
                      : "bg-white/10 border-white/10"
                    }`}>
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {usr.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      {/* Online indicator */}
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-lg truncate ${isScrolled ? "text-slate-800 dark:text-white" : "text-white"}`}>
                        {usr.name || "User"}
                      </p>
                      <p className={`text-sm flex items-center space-x-1 ${isScrolled ? "text-purple-500 dark:text-purple-400" : "text-purple-300"}`}>
                        <SparkleIcon className="w-3 h-3" />
                        <span>Active Now</span>
                      </p>
                    </div>
                  </div>
                )}

                <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)} isScrolled={isScrolled} isActive={isActive("/")}>
                  <HomeIcon />
                  <span>Home</span>
                </MobileNavLink>

                <MobileNavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} isScrolled={isScrolled} isActive={isActive("/profile")}>
                  <ProfileIcon />
                  <span>Profile</span>
                </MobileNavLink>

                {/* Divider */}
                <div className={`my-4 h-px ${isScrolled ? "bg-slate-200 dark:bg-slate-700" : "bg-white/10"}`} />

                {/* Enhanced Mobile Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/30 transition-all duration-300 active:scale-[0.98] border border-red-400/20"
                >
                  <LogoutIcon className="w-5 h-5" />
                  <span>Logout</span>
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-20" />
    </>
  );
}

// Desktop NavLink Component
function NavLink({ to, children, isActive, isScrolled, isSpecial }) {
  if (isSpecial) {
    return (
      <Link
        to={to}
        className="group relative flex items-center space-x-2 px-6 py-2.5 rounded-full font-medium text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white to-transparent" />
        </div>
        <span className="relative z-10 flex items-center space-x-2">{children}</span>
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={`relative flex items-center space-x-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 group
        ${isActive 
          ? isScrolled
            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            : "bg-white/20 text-white"
          : isScrolled
            ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        }`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full" />
      )}
    </Link>
  );
}

// Mobile NavLink Component
function MobileNavLink({ to, children, onClick, isScrolled, isSpecial, isActive }) {
  if (isSpecial) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className="flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 shadow-lg shadow-purple-500/25 active:scale-[0.98] transition-transform duration-200"
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-medium transition-all duration-300 active:scale-[0.98]
        ${isActive
          ? isScrolled
            ? "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-600 dark:text-purple-400 shadow-md"
            : "bg-white/20 text-white"
          : isScrolled
            ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white hover:bg-purple-50 dark:hover:bg-slate-700"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
    >
      {children}
      {isActive && (
        <div className="ml-auto">
          <CheckIcon className="w-5 h-5 text-purple-500" />
        </div>
      )}
    </Link>
  );
}

// Icon Components
function HomeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function LogoutIcon({ className = "" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

function SparkleIcon({ className = "" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z" />
    </svg>
  );
}

function CheckIcon({ className = "" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ArrowRightIcon({ className = "" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}