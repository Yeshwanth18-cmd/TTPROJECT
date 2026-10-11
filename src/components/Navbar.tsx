import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Plus,
  HelpCircle,
  Menu,
  X,
  Repeat,
  Sparkles,
  LogOut,
  UserCheck,
} from "lucide-react";
import { getCurrentUser, logout, switchDemoRole, type CurrentUser } from "../services/auth";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<CurrentUser | null>(getCurrentUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener("uplift_auth_change", handleAuthChange);
    return () => window.removeEventListener("uplift_auth_change", handleAuthChange);
  }, []);

  const handleRoleToggle = () => {
    const nextRole = user?.role === "CLIENT" ? "FREELANCER" : "CLIENT";
    const updated = switchDemoRole(nextRole);
    setUser(updated);
    if (location.pathname === "/dashboard") {
      // re-trigger render
      navigate("/dashboard");
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/");
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="brand" onClick={closeMobile}>
          <div className="brand-mark">U</div>
          <div>
            <div className="brand-name">UpLift</div>
            <div className="brand-tagline">Build. Connect. Grow.</div>
          </div>
        </Link>

        <nav className="main-nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>

          <Link
            to="/projects"
            className={`nav-link ${location.pathname === "/projects" ? "active" : ""}`}
          >
            <BriefcaseBusiness size={16} />
            <span>Explore Projects</span>
          </Link>

          <a href="/#how-it-works" className="nav-link">
            <HelpCircle size={16} />
            <span>How It Works</span>
          </a>

          <a href="/#for-freelancers" className="nav-link">
            <span>For Freelancers</span>
          </a>

          {user && (
            <Link
              to="/dashboard"
              className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </Link>
          )}
        </nav>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            {/* Quick Demo Switcher Pill */}
            <button
              type="button"
              className="role-switch-pill"
              onClick={handleRoleToggle}
              title={`Currently in ${user.role} mode. Click to toggle.`}
            >
              <Repeat size={13} />
              <span className="role-switch-label">Role:</span>
              <strong className="role-switch-value">
                {user.role === "CLIENT" ? "Client" : "Freelancer"}
              </strong>
            </button>

            {user.role === "CLIENT" && (
              <Link to="/post-project" className="post-project-button">
                <Plus size={16} />
                <span>Post Project</span>
              </Link>
            )}

            <div
              className="user-avatar"
              title={`${user.name} (${user.role})`}
              onClick={() => navigate("/dashboard")}
              style={{ cursor: "pointer" }}
            >
              {user.name?.trim().charAt(0).toUpperCase() || "U"}
            </div>

            <button
              className="secondary-button navbar-logout"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={15} />
              <span className="hide-sm">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="secondary-button login-btn-compact">
              Login
            </Link>
            <Link to="/register" className="primary-button register-btn-compact">
              <Sparkles size={15} />
              Get Started
            </Link>
          </>
        )}

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-toggle icon-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={closeMobile}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <Link to="/" className="brand" onClick={closeMobile}>
                <div className="brand-mark">U</div>
                <div className="brand-name">UpLift</div>
              </Link>
              <button className="icon-button" onClick={closeMobile}>
                <X size={18} />
              </button>
            </div>

            <div className="mobile-nav-links">
              <Link to="/" className="mobile-nav-link" onClick={closeMobile}>
                Home
              </Link>
              <Link to="/projects" className="mobile-nav-link" onClick={closeMobile}>
                <BriefcaseBusiness size={17} />
                Explore Projects
              </Link>
              <a href="/#how-it-works" className="mobile-nav-link" onClick={closeMobile}>
                <HelpCircle size={17} />
                How It Works
              </a>
              <a href="/#for-freelancers" className="mobile-nav-link" onClick={closeMobile}>
                For Freelancers
              </a>

              {user && (
                <Link to="/dashboard" className="mobile-nav-link" onClick={closeMobile}>
                  <LayoutDashboard size={17} />
                  Dashboard ({user.role})
                </Link>
              )}

              {user?.role === "CLIENT" && (
                <Link to="/post-project" className="mobile-nav-link" onClick={closeMobile}>
                  <Plus size={17} />
                  Post a Project
                </Link>
              )}
            </div>

            <div className="mobile-drawer-footer">
              {user ? (
                <>
                  <div className="mobile-user-card">
                    <div className="user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong>{user.name}</strong>
                      <p>{user.email}</p>
                    </div>
                  </div>
                  <button
                    className="secondary-button"
                    style={{ width: "100%", justifyContent: "center", marginBottom: 8 }}
                    onClick={() => {
                      handleRoleToggle();
                      closeMobile();
                    }}
                  >
                    <Repeat size={15} /> Switch to {user.role === "CLIENT" ? "Freelancer" : "Client"} Mode
                  </button>
                  <button
                    className="text-button"
                    style={{ width: "100%", textAlign: "center" }}
                    onClick={() => {
                      handleLogout();
                      closeMobile();
                    }}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  <Link
                    to="/login"
                    className="secondary-button"
                    style={{ justifyContent: "center" }}
                    onClick={closeMobile}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="primary-button"
                    style={{ justifyContent: "center" }}
                    onClick={closeMobile}
                  >
                    Get Started
                  </Link>
                  <button
                    className="secondary-button demo-quick-btn"
                    onClick={() => {
                      switchDemoRole("CLIENT");
                      closeMobile();
                      navigate("/dashboard");
                    }}
                  >
                    <UserCheck size={15} /> Instant Demo Access
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}