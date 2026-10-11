import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  IndianRupee,
  Calendar,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCurrentUser } from "../services/auth";
import { createStoredProject } from "../services/storage";

export default function PostProject() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("AI & Machine Learning");
  const [skillsInput, setSkillsInput] = useState("React, Python, FastAPI");
  const [budgetMin, setBudgetMin] = useState("15000");
  const [budgetMax, setBudgetMax] = useState("25000");
  const [duration, setDuration] = useState("2-3 weeks");
  const [deliverablesInput, setDeliverablesInput] = useState(
    "Working prototype with clean GitHub repository\nComprehensive setup documentation\nLive Vercel / Cloud deployment demo"
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Project title is required.");
      return;
    }

    if (title.trim().length < 8) {
      setError("Please provide a descriptive title (at least 8 characters).");
      return;
    }

    if (!description.trim() || description.trim().length < 25) {
      setError("Please provide a detailed description (at least 25 characters).");
      return;
    }

    if (!category) {
      setError("Please select a project category.");
      return;
    }

    const min = Number(budgetMin);
    const max = Number(budgetMax);

    if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0) {
      setError("Please enter valid positive numbers for both budget fields.");
      return;
    }

    if (min > max) {
      setError("Minimum budget cannot be greater than maximum budget.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Parse skills
      const skillsArray = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      // Parse deliverables
      const deliverablesArray = deliverablesInput
        .split("\n")
        .map((d) => d.trim())
        .filter((d) => d.length > 0);

      const newProject = createStoredProject({
        title: title.trim(),
        description: description.trim(),
        category,
        skills: skillsArray.length > 0 ? skillsArray : ["General"],
        budgetMin: min,
        budgetMax: max,
        duration,
        clientId: user?.userId || 101,
        clientName: user?.company || user?.name || "TechCraft Labs",
        deliverables: deliverablesArray,
      });

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        navigate(`/projects?id=${newProject.id}`);
      }, 1200);
    }, 400);
  };

  return (
    <div className="post-project-page-wrapper">
      <Navbar />

      <main className="dashboard-page">
        <div className="post-project-container">
          <div className="page-header">
            <div className="hero-eyebrow">
              <span className="eyebrow-pill">
                <Sparkles size={13} />
                CLIENT PORTAL • POST A PROBLEM
              </span>
            </div>
            <h1>Create a New Project</h1>
            <p className="page-header-sub">
              Describe what you need built. UpLift's AI match engine will pair your challenge with verified emerging developers.
            </p>
          </div>

          {/* Prototype disclaimer badge */}
          <div className="prototype-hint-box" style={{ marginBottom: 24 }}>
            <Sparkles size={18} />
            <div>
              <strong>Prototype Mode Active:</strong>
              <p>
                This project will be stored locally in your browser storage and will be immediately visible on the Explore Projects marketplace and your Client Dashboard across page refreshes.
              </p>
            </div>
          </div>

          {success ? (
            <div className="form-success-card">
              <CheckCircle2 size={42} className="success-icon" />
              <h2>Project Created Successfully!</h2>
              <p>
                "{title}" has been saved and added to the UpLift live marketplace. Redirecting to your project view...
              </p>
              <Link to="/projects" className="primary-button" style={{ marginTop: 16 }}>
                View in Marketplace <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="form-card">
              {error && (
                <div className="form-error" role="alert">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="project-title">
                    Project Title *
                    <span className="field-hint">A clear, specific headline describing the deliverable</span>
                  </label>
                  <input
                    id="project-title"
                    type="text"
                    required
                    placeholder="e.g. Build an AI-Powered Document Search Assistant"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-row-2col">
                  <div className="form-group">
                    <label htmlFor="project-category">Category *</label>
                    <select
                      id="project-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                      <option value="Web Development">Web Development</option>
                      <option value="App Development">App Development</option>
                      <option value="Automation & Data">Automation & Data</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Other">Other Technical Service</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="project-duration">Estimated Timeline *</label>
                    <select
                      id="project-duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    >
                      <option value="1-2 weeks">1–2 weeks</option>
                      <option value="2-3 weeks">2–3 weeks</option>
                      <option value="3-4 weeks">3–4 weeks</option>
                      <option value="1-2 months">1–2 months</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="project-description">
                    Problem & Requirements Description *
                    <span className="field-hint">Explain the objective, business background, and expected outcome</span>
                  </label>
                  <textarea
                    id="project-description"
                    rows={6}
                    required
                    placeholder="Describe your technical problem, current setup, desired features, and how you plan to test the solution..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="project-skills">
                    Required Skills / Technologies (comma separated) *
                    <span className="field-hint">e.g. React, Python, FastAPI, Docker, Tailwind CSS</span>
                  </label>
                  <input
                    id="project-skills"
                    type="text"
                    placeholder="React, TypeScript, Python, FastAPI"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                  />
                </div>

                <div className="budget-grid">
                  <div className="form-group">
                    <label htmlFor="budget-min">Minimum Budget (₹ INR) *</label>
                    <input
                      id="budget-min"
                      type="number"
                      min="1000"
                      step="500"
                      required
                      placeholder="15000"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="budget-max">Maximum Budget (₹ INR) *</label>
                    <input
                      id="budget-max"
                      type="number"
                      min="1000"
                      step="500"
                      required
                      placeholder="25000"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="project-deliverables">
                    Key Deliverables (one per line)
                    <span className="field-hint">Define tangible milestones that verify project completion</span>
                  </label>
                  <textarea
                    id="project-deliverables"
                    rows={3}
                    placeholder="Live Vercel deployment preview&#10;Clean GitHub repository&#10;Documentation & handover demo"
                    value={deliverablesInput}
                    onChange={(e) => setDeliverablesInput(e.target.value)}
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={loading}
                  >
                    {loading ? "Publishing Project..." : "Post Project to Marketplace"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}