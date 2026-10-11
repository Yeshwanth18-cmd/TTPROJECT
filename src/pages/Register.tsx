import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sparkles, BriefcaseBusiness, Users, ShieldCheck } from "lucide-react";
import { registerMock, loginAsDemo } from "../services/auth";
import type { UserRole } from "../types/auth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("CLIENT");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      registerMock(name.trim(), email.trim(), password, role);
      setLoading(false);
      navigate("/dashboard");
    }, 350);
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    loginAsDemo(demoRole);
    navigate("/dashboard");
  };

  return (
    <div className="auth-page-wrapper">
      <Navbar />

      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            <div className="login-brand">
              <div className="brand-mark">U</div>
              <h1 className="login-title">Join UpLift</h1>
              <p className="login-subtitle">
                Create your account to start hiring or offering technical services.
              </p>
            </div>

            {/* Quick Demo Access Box */}
            <div className="demo-quick-auth-box">
              <div className="demo-quick-auth-header">
                <Sparkles size={15} />
                <span>Instant Prototype Evaluation</span>
              </div>
              <p className="demo-quick-auth-sub">
                Skip registration and jump right into the full interactive dashboards:
              </p>
              <div className="demo-quick-buttons">
                <button
                  type="button"
                  className="quick-role-btn client-quick"
                  onClick={() => handleQuickDemo("CLIENT")}
                >
                  <BriefcaseBusiness size={15} />
                  <div>
                    <strong>Demo as Client</strong>
                    <span>TechCraft Labs</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="quick-role-btn freelancer-quick"
                  onClick={() => handleQuickDemo("FREELANCER")}
                >
                  <Users size={15} />
                  <div>
                    <strong>Demo as Freelancer</strong>
                    <span>Ananya Roy</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="auth-divider">
              <span>Or create a new demo account</span>
            </div>

            {error && (
              <div className="form-error" role="alert" style={{ marginBottom: 16 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Role Selection Tabs */}
              <div className="form-group">
                <label>I want to join UpLift as a:</label>
                <div className="role-selection-grid">
                  <button
                    type="button"
                    className={`role-select-box ${role === "CLIENT" ? "active" : ""}`}
                    onClick={() => setRole("CLIENT")}
                  >
                    <BriefcaseBusiness size={18} />
                    <strong>Client / Startup</strong>
                    <span>I want to post problems and hire tech talent</span>
                  </button>

                  <button
                    type="button"
                    className={`role-select-box ${role === "FREELANCER" ? "active" : ""}`}
                    onClick={() => setRole("FREELANCER")}
                  >
                    <Users size={18} />
                    <strong>Freelancer / Student</strong>
                    <span>I want to find projects and build solutions</span>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Aakash Mehta"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password (min. 6 characters)</label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="form-input"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-button login-submit"
                disabled={loading}
              >
                {loading ? "Creating Account..." : `Join as ${role === "CLIENT" ? "Client" : "Freelancer"}`}
              </button>
            </form>

            <div className="login-footer">
              <span>Already have an account? </span>
              <Link to="/login">Sign in here</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}