import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sparkles, UserCheck, BriefcaseBusiness, Users, Shield } from "lucide-react";
import { loginMock, loginAsDemo } from "../services/auth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      loginMock(email.trim(), password);
      setLoading(false);
      navigate("/dashboard");
    }, 350);
  };

  const handleQuickDemo = (role: "CLIENT" | "FREELANCER" | "ADMIN") => {
    loginAsDemo(role);
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
              <h1 className="login-title">Welcome back to UpLift</h1>
              <p className="login-subtitle">
                Sign in to your account or jump in instantly with demo credentials.
              </p>
            </div>

            {/* ONE-CLICK DEMO AUTH BANNER */}
            <div className="demo-quick-auth-box">
              <div className="demo-quick-auth-header">
                <Sparkles size={15} />
                <span>One-Click Prototype Demo Access</span>
              </div>
              <p className="demo-quick-auth-sub">
                No credentials needed. Select a persona to test the platform immediately:
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
                    <span>TechCraft Labs (Founder)</span>
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
                    <span>Ananya Roy (Full-Stack & AI)</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="auth-divider">
              <span>Or sign in with email</span>
            </div>

            {error && (
              <div className="form-error" role="alert" style={{ marginBottom: 16 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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

              <button
                type="submit"
                className="primary-button login-submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In to UpLift"}
              </button>
            </form>

            <div className="login-footer">
              <span>Don't have an account yet? </span>
              <Link to="/register">Create an account</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}