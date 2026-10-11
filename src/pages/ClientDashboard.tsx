import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  Plus,
  Repeat,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  Activity,
  IndianRupee,
  Calendar,
  Check,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCurrentUser, switchDemoRole } from "../services/auth";
import {
  getStoredProjects,
  getStoredProposals,
  getStoredActivities,
  updateStoredProposalStatus,
  updateStoredProjectStatus,
  getDashboardStats,
} from "../services/storage";
import type { Project, ProjectStatus } from "../types/project";
import type { Proposal, DashboardStats } from "../types/proposal";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [projects, setProjects] = useState<Project[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [activities, setActivities] = useState(getStoredActivities());
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [actionToast, setActionToast] = useState<string | null>(null);

  const loadData = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    const allProjects = getStoredProjects();
    const allProposals = getStoredProposals();

    // Client's projects or all if admin
    const myProjects = allProjects.filter(
      (p) => p.clientId === (currentUser?.userId || 101)
    );
    // If user has no specific posted projects, show all projects for demo completeness
    const clientProjects = myProjects.length > 0 ? myProjects : allProjects;
    setProjects(clientProjects);

    // Incoming proposals for client's projects
    const projectIds = new Set(clientProjects.map((p) => p.id));
    const incomingProposals = allProposals.filter((prop) => projectIds.has(prop.projectId));
    setProposals(incomingProposals.length > 0 ? incomingProposals : allProposals);

    setStats(getDashboardStats("CLIENT", currentUser?.userId || 101));
    setActivities(getStoredActivities());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleSwitch = () => {
    switchDemoRole("FREELANCER");
    navigate("/dashboard");
  };

  const handleProposalDecision = (proposalId: number, status: "ACCEPTED" | "REJECTED") => {
    const updated = updateStoredProposalStatus(proposalId, status);
    if (updated) {
      setActionToast(
        status === "ACCEPTED"
          ? `Accepted proposal from ${updated.freelancerName}! Project is now In Progress.`
          : `Declined proposal from ${updated.freelancerName}.`
      );
      loadData();
      setTimeout(() => setActionToast(null), 4000);
    }
  };

  const handleProjectStatusChange = (projectId: number, newStatus: ProjectStatus) => {
    const updated = updateStoredProjectStatus(projectId, newStatus);
    if (updated) {
      setActionToast(`Project status updated to ${newStatus.replace("_", " ")}.`);
      loadData();
      setTimeout(() => setActionToast(null), 4000);
    }
  };

  return (
    <div className="dashboard-page-wrapper">
      <Navbar />

      <main className="dashboard-page">
        {/* Header */}
        <div className="dashboard-header marketplace-heading">
          <div>
            <div className="dashboard-role-badge">
              <span className="eyebrow">CLIENT WORKSPACE</span>
              <span className="demo-indicator-pill">Demo Mode</span>
            </div>
            <h1>
              Welcome back, <span>{user?.name || "Aakash Mehta"}</span>
            </h1>
            <p className="dashboard-description">
              Manage your technical projects, review freelancer bids, and track active project milestones in real time.
            </p>
          </div>

          <div className="dashboard-actions">
            <button
              type="button"
              className="secondary-button role-toggle-btn"
              onClick={handleRoleSwitch}
              title="Switch to Freelancer demo view"
            >
              <Repeat size={15} /> Switch to Freelancer View
            </button>
            <Link className="primary-button" to="/post-project">
              <Plus size={16} /> Post a Project
            </Link>
          </div>
        </div>

        {/* Action toast */}
        {actionToast && (
          <div className="demo-confirmation-toast" role="alert">
            <Sparkles size={17} />
            <div>
              <strong>Action Saved</strong>
              <p>{actionToast}</p>
            </div>
            <button onClick={() => setActionToast(null)} className="toast-close-btn">
              <X size={15} />
            </button>
          </div>
        )}

        {/* KPI Stats Grid */}
        <section className="stats-grid dashboard-metrics" aria-label="Project statistics">
          <article className="stat-card">
            <BriefcaseBusiness />
            <div>
              <strong>{stats?.totalProjects ?? projects.length}</strong>
              <span>Posted Projects</span>
            </div>
          </article>
          <article className="stat-card">
            <Clock3 />
            <div>
              <strong>{stats?.inProgressProjects ?? 1}</strong>
              <span>In Progress</span>
            </div>
          </article>
          <article className="stat-card">
            <CheckCircle2 />
            <div>
              <strong>{stats?.completedProjects ?? 1}</strong>
              <span>Completed</span>
            </div>
          </article>
          <article className="stat-card">
            <FileText />
            <div>
              <strong>{stats?.pendingProposals ?? 0}</strong>
              <span>Pending Proposals</span>
            </div>
          </article>
        </section>

        {/* Main Dashboard Layout: Two Columns */}
        <div className="dashboard-layout-2col">
          {/* Left Column: Proposals & Projects */}
          <div className="dashboard-main-col">
            {/* Incoming Proposals */}
            <section className="dashboard-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">INCOMING BIDS</p>
                  <h2>Received Proposals ({proposals.length})</h2>
                </div>
                <span className="subtext-muted">Review, accept, or decline bids</span>
              </div>

              {proposals.length === 0 ? (
                <div className="empty-state compact-empty">
                  <FileText size={26} />
                  <h3>No incoming proposals yet</h3>
                  <p>When freelancers bid on your projects, their proposals will appear here.</p>
                </div>
              ) : (
                <div className="proposal-list">
                  {proposals.map((proposal) => (
                    <article className="proposal-card" key={proposal.id}>
                      <div className="proposal-card-heading">
                        <div>
                          <p className="card-eyebrow">{proposal.projectTitle}</p>
                          <h3>{proposal.freelancerName}</h3>
                          <span className="freelancer-email-text">{proposal.freelancerEmail}</span>
                        </div>
                        <span className={`status-pill status-${proposal.status.toLowerCase()}`}>
                          {proposal.status}
                        </span>
                      </div>

                      <div className="proposal-facts">
                        <strong>{currency.format(proposal.amount)}</strong>
                        <span>
                          <Clock3 size={13} style={{ display: "inline", marginRight: 4 }} />
                          {proposal.deliveryDays} days delivery
                        </span>
                        <span>
                          <Calendar size={13} style={{ display: "inline", marginRight: 4 }} />
                          Received {new Date(proposal.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="proposal-letter">{proposal.coverLetter}</p>

                      {proposal.status === "PENDING" && (
                        <div className="proposal-actions">
                          <button
                            type="button"
                            className="secondary-button decline-btn"
                            onClick={() => handleProposalDecision(proposal.id, "REJECTED")}
                          >
                            <X size={14} /> Decline
                          </button>
                          <button
                            type="button"
                            className="primary-button accept-btn"
                            onClick={() => handleProposalDecision(proposal.id, "ACCEPTED")}
                          >
                            <Check size={14} /> Accept Proposal
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* Client's Posted Projects */}
            <section className="dashboard-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">PORTFOLIO</p>
                  <h2>Your Posted Projects ({projects.length})</h2>
                </div>
                <Link to="/post-project" className="view-link">
                  + Post New <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="dashboard-projects-table-card">
                {projects.map((project) => (
                  <div className="client-project-item" key={project.id}>
                    <div className="project-row-left">
                      <div className="project-status-dot-indicator">
                        <span className={`status-dot status-${project.status.toLowerCase()}`} />
                      </div>
                      <div>
                        <strong>{project.title}</strong>
                        <div className="project-sub-meta">
                          <span>{project.category}</span> •{" "}
                          <span>{currency.format(project.budgetMin ?? 0)} – {currency.format(project.budgetMax ?? 0)}</span> •{" "}
                          <span>{project.proposalsCount || 0} proposals</span>
                        </div>
                      </div>
                    </div>

                    <div className="project-row-actions">
                      <span className={`status-pill status-${project.status.toLowerCase()}`}>
                        {project.status.replace("_", " ")}
                      </span>

                      {project.status === "OPEN" && (
                        <button
                          className="text-button"
                          onClick={() => handleProjectStatusChange(project.id, "CANCELLED")}
                        >
                          Cancel
                        </button>
                      )}

                      {project.status === "IN_PROGRESS" && (
                        <button
                          className="secondary-button"
                          onClick={() => handleProjectStatusChange(project.id, "COMPLETED")}
                        >
                          Mark Completed
                        </button>
                      )}

                      <Link to={`/projects?id=${project.id}`} className="icon-button" title="View details">
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: AI Recommended Talent & Recent Activity Feed */}
          <div className="dashboard-sidebar-col">
            {/* AI Talent Suggestions */}
            <section className="dashboard-card">
              <div className="card-header">
                <div>
                  <p className="card-eyebrow">AI TALENT MATCHING</p>
                  <h2>Recommended Developers</h2>
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
                  <strong>96%</strong>
                  <span>match</span>
                </div>
              </div>

              <div className="talent-card">
                <div className="talent-avatar">AR</div>
                <div className="talent-info">
                  <strong>Ananya Roy</strong>
                  <span>AI & LangChain Developer</span>
                  <div className="skill-tags">
                    <span>Python</span>
                    <span>FastAPI</span>
                    <span>LangChain</span>
                  </div>
                </div>
                <div className="match-score">
                  <strong>94%</strong>
                  <span>match</span>
                </div>
              </div>

              <div className="talent-card">
                <div className="talent-avatar">KP</div>
                <div className="talent-info">
                  <strong>Kavya Patel</strong>
                  <span>UI/UX & Frontend Specialist</span>
                  <div className="skill-tags">
                    <span>Figma</span>
                    <span>Next.js</span>
                    <span>Tailwind</span>
                  </div>
                </div>
                <div className="match-score">
                  <strong>91%</strong>
                  <span>match</span>
                </div>
              </div>
            </section>

            {/* Recent Activity Feed */}
            <section className="dashboard-card activity-feed-card">
              <div className="card-header">
                <div>
                  <p className="card-eyebrow">AUDIT LOG</p>
                  <h2>Recent Activity</h2>
                </div>
                <Activity size={16} className="activity-icon-muted" />
              </div>

              <div className="activity-timeline">
                {activities.slice(0, 5).map((act) => (
                  <div className="activity-item" key={act.id}>
                    <div className="activity-dot" />
                    <div className="activity-body">
                      <strong>{act.title}</strong>
                      <p>{act.description}</p>
                      <span className="activity-time">{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
