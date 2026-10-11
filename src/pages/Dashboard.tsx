import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  logout,
} from "../services/auth";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Clock3,
  IndianRupee,
  Users,
} from "lucide-react";

import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();
const user = getCurrentUser();
  return (
    <div className="app-shell">
      <Navbar />

      <main className="dashboard-page">
        <section className="dashboard-header">
          <div>
  <p className="eyebrow">
    {user?.role === "FREELANCER"
      ? "FREELANCER DASHBOARD"
      : "CLIENT DASHBOARD"}
  </p>

  <h1>
    {user?.role === "FREELANCER"
      ? `Welcome back, ${user.name}.`
      : `Build something great, ${user?.name}.`}
  </h1>

  <p>
    {user?.role === "FREELANCER"
      ? "Find projects, submit proposals, and grow your portfolio."
      : "Post a project and find the right talent to build it."}
  </p>
</div>

          <div className="dashboard-actions">
            <button className="primary-button">
              <BriefcaseBusiness size={17} />
              Post a Project
            </button>
          </div>
        </section>

        <section className="stats-grid">
          <StatCard
            title="Active Projects"
            value="4"
            icon={<BriefcaseBusiness size={20} />}
            trend="+2 this month"
          />

          <StatCard
            title="Total Spent"
            value="₹24,500"
            icon={<IndianRupee size={20} />}
            trend="+12% this month"
          />

          <StatCard
            title="Talent Hired"
            value="7"
            icon={<Users size={20} />}
            trend="+3 this month"
          />

          <StatCard
            title="Avg. Delivery"
            value="6.2 days"
            icon={<Clock3 size={20} />}
            trend="18% faster"
          />
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <p className="card-eyebrow">PROJECTS</p>
                <h2>Recent projects</h2>
              </div>

              <a href="/projects" className="view-link">
                View all
                <ArrowUpRight size={15} />
              </a>
            </div>

            <div className="project-list">
              <ProjectRow
                title="Portfolio Website"
                freelancer="React Developer"
                status="In Progress"
                budget="₹7,500"
              />

              <ProjectRow
                title="AI Chatbot Integration"
                freelancer="AI/ML Developer"
                status="Review"
                budget="₹12,000"
              />

              <ProjectRow
                title="Social Media Automation"
                freelancer="Automation Specialist"
                status="Completed"
                budget="₹5,000"
              />
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <p className="card-eyebrow">AI MATCHING</p>
                <h2>Recommended talent</h2>
              </div>
            </div>

            <div className="talent-card">
              <div className="talent-avatar">AK</div>

              <div className="talent-info">
                <strong>Arjun Kumar</strong>
                <span>Full Stack Developer</span>

                <div className="skill-tags">
                  <span>React</span>
                  <span>Node.js</span>
                  <span>PostgreSQL</span>
                </div>
              </div>

              <div className="match-score">
                <strong>94%</strong>
                <span>match</span>
              </div>
            </div>

            <div className="talent-card">
              <div className="talent-avatar">PS</div>

              <div className="talent-info">
                <strong>Priya Sharma</strong>
                <span>AI/ML Developer</span>

                <div className="skill-tags">
                  <span>Python</span>
                  <span>TensorFlow</span>
                  <span>AI</span>
                </div>
              </div>

              <div className="match-score">
                <strong>89%</strong>
                <span>match</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: string;
  icon: ReactNode;
  trend: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div className="stat-content">
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{trend}</small>
      </div>
    </div>
  );
}

function ProjectRow({
  title,
  freelancer,
  status,
  budget,
}: {
  title: string;
  freelancer: string;
  status: string;
  budget: string;
}) {
  return (
    <div className="project-row">
      <div className="project-icon">
        <BriefcaseBusiness size={18} />
      </div>

      <div className="project-info">
        <strong>{title}</strong>
        <span>{freelancer}</span>
      </div>

      <span className={`status ${status.toLowerCase().replace(" ", "-")}`}>
        {status}
      </span>

      <strong className="project-budget">
        {budget}
      </strong>
    </div>
  );
}