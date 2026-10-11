import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Plus,
} from "lucide-react";
import { getCurrentUser } from "../services/auth";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    path: "/projects",
    icon: BriefcaseBusiness,
  },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="brand">
          <div className="brand-mark">U</div>

          <div>
            <div className="brand-name">UpLift</div>
            <div className="brand-tagline">
              Build. Connect. Grow.
            </div>
          </div>
        </Link>

        <nav className="main-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${active ? "active" : ""}`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="navbar-right">
        {user?.role === "CLIENT" && (
          <Link to="/post-project" className="post-project-button">
            <Plus size={17} />
            Post Project
          </Link>
        )}

        <div className="user-avatar">
          {user?.name?.trim().charAt(0).toUpperCase() || "U"}
        </div>
        <button
          className="secondary-button navbar-logout"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}