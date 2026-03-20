import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  BrainCircuit,
  LogOut,
  LayoutDashboard,
  Lock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const isLandingPage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (!isLandingPage) return;

      const sections = ["about", "features", "testimonials", "pricing"];
      let current = "";

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          if (window.scrollY >= top - 150) current = section;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLandingPage]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleResumeClick = () => {
    if (!isAuthenticated) {
      alert("Please login to use Resume feature");
      navigate("/login");
    } else {
      navigate("/resume");
    }
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600/20 p-2 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-xl font-bold text-white">MockAI</span>
          </Link>

          {/* Landing Page Links */}
          {isLandingPage && (
            <div className="hidden md:flex gap-8 text-sm">
              {["about", "features", "testimonials", "pricing"].map((s) => (
                <a
                  key={s}
                  href={`#${s}`}
                  className={`${
                    activeSection === s
                      ? "text-indigo-400"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {s === "about"
                    ? "How It Works"
                    : s.charAt(0).toUpperCase() + s.slice(1)}
                </a>
              ))}
            </div>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Resume Button (Always Visible) */}
            <button
              onClick={handleResumeClick}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white"
            >
              {!isAuthenticated && <Lock className="w-4 h-4 text-yellow-400" />}
              Upload Resume
            </button>

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                    {getUserInitials(user?.name)}
                  </div>
                  <span className="text-sm text-slate-300">
                    {user?.name?.split(" ")[0]}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-slate-300 hover:text-white text-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-indigo-600 px-4 py-2 rounded text-white text-sm"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 p-4 space-y-4">
          <button
            onClick={() => {
              handleResumeClick();
              setIsMobileMenuOpen(false);
            }}
            className="block text-slate-300"
          >
            Upload Resume
          </button>

          {isAuthenticated ? (
            <>
              <button onClick={() => navigate("/dashboard")}>Dashboard</button>
              <button onClick={handleLogout} className="text-red-400">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")}>Sign In</button>
              <button onClick={() => navigate("/register")}>Get Started</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
