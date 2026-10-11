import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  Repeat,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  Activity,
  Star,
  ShieldCheck,
  Send,
  Calendar,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCurrentUser, switchDemoRole } from "../services/auth";
import {
  getStoredProjects,
  getStoredProposals,
  getStoredActivities,
  getDashboardStats,
} from "../services/storage";
import type { Project } from "../types/project";
import type { Proposal, DashboardStats } from "../types/proposal";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function FreelancerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [recommendedProjects, setRecommendedProjects] = useState<Project[]>([]);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState(getStoredActivities());

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    const allProjects = getStoredProjects();
    const allProposals = getStoredProposals();

    // Freelancer's proposals
    const myProposals = allProposals.filter(
      (p) => p.freelancerId === (currentUser?.userId || 201)
    );
    // Fallback if none found
    setProposals(myProposals.length > 0 ? myProposals : allProposals.slice(0, 3));

    // Recommended projects (open projects with high match)
    const open = allProjects.filter((p) => p.status === "OPEN");
    setRecommendedProjects(open.slice(0, 3));

    // Active projects (in progress)
    const active = allProjects.filter((p) => p.status === "IN_PROGRESS");
    setActiveProjects(active);

    setStats(getDashboardStats("FREELANCER", currentUser?.userId || 201));
    setActivities(getStoredActivities());
  }, []);

  const handleRoleSwitch = () => {
    switchDemoRole("CLIENT");
    navigate("/dashboard");
  };

  return (
    <div className="dashboard-page-wrapper">
      <Navbar />

      <main className="dashboard-page">
        {/* Header */}
        <div className="dashboard-header marketplace-heading">
          <div>
            <div className="dashboard-role-badge">
              <span className="eyebrow">FREELANCER WORKSPACE</span>
              <span className="demo-indicator-pill">Demo Mode</span>
            </div>
            <h1>
              Welcome back, <span>{user?.name || "Ananya Roy"}</span>
            </h1>
            <p className="dashboard-description">
              Find technical problems matched to your skills, track your submitted bids, and grow your engineering portfolio.
            </p>
          </div>

          <div className="dashboard-actions">
            <button
              type="button"
              className="secondary-button role-toggle-btn"
              onClick={handleRoleSwitch}
              title="Switch to Client demo view"
            >
              <Repeat size={15} /> Switch to Client View
            </button>
            <Link className="primary-button" to="/projects">
              <BriefcaseBusiness size={16} /> Browse Projects
            </Link>
          </div>
        </div>

        {/* Profile Card & Stats Grid Row */}
        <div className="freelancer-overview-row">
          {/* Profile Overview Card */}
          <div className="freelancer-profile-card">
            <div className="profile-header-meta">
              <div className="profile-avatar-large">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div>
                <div className="profile-name-row">
                  <h3>{user?.name || "Ananya Roy"}</h3>
                  <span className="verified-pill">
                    <ShieldCheck size={13} /> Verified Talent
                  </span>
                </div>
                <p className="profile-title">
                  {user?.title || "Full-Stack Developer & AI Specialist"}
                </p>
                <div className="rating-row">
                  <div className="star-rating">
                    <Star size={14} className="star-filled" />
                    <strong>4.9</strong>
                    <span>(14 completed client projects)</span>
                  </div>
                  <span className="rate-badge">₹950 / hr</span>
                </div>
              </div>
            </div>

            <p className="profile-bio-text">
              Final-year computer science student building practical AI agents, FastAPI backends, and responsive React applications. Passionate about shipping clean, production-grade code.
            </p>

            <div className="freelancer-skills-chips">
              <span className="skill-chip">React</span>
              <span className="skill-chip">TypeScript</span>
              <span className="skill-chip">Python</span>
              <span className="skill-chip">FastAPI</span>
              <span className="skill-chip">LangChain</span>
              <span className="skill-chip">Tailwind CSS</span>
              <span className="skill-chip">Docker</span>
            </div>
          </div>

          {/* 4 Stats Cards */}
          <div className="freelancer-stats-grid">
            <article className="stat-card">
              <BriefcaseBusiness />
              <div>
                <strong>{stats?.openProjects ?? 6}</strong>
                <span>Open Opportunities</span>
              </div>
            </article>
            <article className="stat-card">
              <Clock3 />
              <div>
                <strong>{activeProjects.length}</strong>
                <span>Active Work</span>
              </div>
            </article>
            <article className="stat-card">
              <CheckCircle2 />
              <div>
                <strong>14</strong>
                <span>Completed Jobs</span>
              </div>
            </article>
            <article className="stat-card">
              <FileText />
              <div>
                <strong>{proposals.length}</strong>
                <span>Proposals Sent</span>
              </div>
            </article>
          </div>
        </div>

        {/* 2-Column Dashboard Sections */}
        <div className="dashboard-layout-2col" style={{ marginTop: 24 }}>
          {/* Left Column: Submitted Proposals & Active Work */}
          <div className="dashboard-main-col">
            {/* Submitted Proposals Section */}
            <section className="dashboard-section" style={{ marginTop: 0 }}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">YOUR APPLICATIONS</p>
                  <h2>Submitted Proposals ({proposals.length})</h2>
                </div>
                <Link to="/projects" className="view-link">
                  Browse More <ArrowUpRight size={14} />
                </Link>
              </div>

              {proposals.length === 0 ? (
                <div className="empty-state compact-empty">
                  <FileText size={26} />
                  <h3>No submitted proposals yet</h3>
                  <p>Explore marketplace projects and send a bid to start collaborating.</p>
                  <Link to="/projects" className="primary-button">
                    Explore Projects
                  </Link>
                </div>
              ) : (
                <div className="proposal-list">
                  {proposals.map((proposal) => (
                    <article className="proposal-card" key={proposal.id}>
                      <div className="proposal-card-heading">
                        <div>
                          <p className="card-eyebrow">{proposal.projectTitle}</p>
                          <div className="proposal-facts" style={{ marginTop: 4 }}>
                            <strong>{currency.format(proposal.amount)}</strong>
                            <span>• {proposal.deliveryDays} days timeline</span>
                            <span>• Submitted {new Date(proposal.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <span className={`status-pill status-${proposal.status.toLowerCase()}`}>
                          {proposal.status}
                        </span>
                      </div>

                      <p className="proposal-letter">{proposal.coverLetter}</p>

                      <div className="proposal-footer-meta-row">
                        <span className="bid-state-hint">
                          {proposal.status === "ACCEPTED" && (
                            <span className="state-success-text">
                              🎉 Accepted by client! Development milestone active.
                            </span>
                          )}
                          {proposal.status === "PENDING" && (
                            <span className="state-pending-text">
                              ⏳ Awaiting client review. You will be notified when accepted.
                            </span>
                          )}
                          {proposal.status === "REJECTED" && (
                            <span className="state-muted-text">
                              Proposal was declined for this project. Keep exploring!
                            </span>
                          )}
                        </span>
                        <Link to={`/projects?id=${proposal.projectId}`} className="view-link">
                          View Project <ExternalLink size={13} />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* Active Engagements */}
            <section className="dashboard-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">IN PROGRESS</p>
                  <h2>Active Engagements ({activeProjects.length})</h2>
                </div>
              </div>

              {activeProjects.length === 0 ? (
                <div className="empty-state compact-empty">
                  <Clock3 size={24} />
                  <h3>No projects currently in progress</h3>
                  <p>When a client accepts your proposal, your active milestones show here.</p>
                </div>
              ) : (
                <div className="dashboard-projects-table-card">
                  {activeProjects.map((p) => (
                    <div className="client-project-item" key={p.id}>
                      <div className="project-row-left">
                        <div className="project-status-dot-indicator">
                          <span className="status-dot status-in_progress" />
                        </div>
                        <div>
                          <strong>{p.title}</strong>
                          <div className="project-sub-meta">
                            <span>Client: {p.clientName || "TechCraft"}</span> •{" "}
                            <span>Est: {p.duration || "2 weeks"}</span> •{" "}
                            <span>{p.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="project-row-actions">
                        <span className="status-pill status-in_progress">In Progress</span>
                        <Link to={`/projects?id=${p.id}`} className="icon-button" title="View details">
                          <ExternalLink size={14} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column: AI Recommended Projects & Activity */}
          <div className="dashboard-sidebar-col">
            {/* Recommended Projects Card */}
            <section className="dashboard-card">
              <div className="card-header">
                <div>
                  <p className="card-eyebrow">AI MATCH ENGINE</p>
                  <h2>Recommended For You</h2>
                </div>
                <Sparkles size={16} className="sparkle-icon-accent" />
              </div>

              <div className="recommended-projects-list">
                {recommendedProjects.map((proj, idx) => {
                  const matchScores = [96, 92, 88];
                  const score = matchScores[idx % matchScores.length];

                  return (
                    <div className="recommended-proj-item" key={proj.id}>
                      <div className="rec-top-row">
                        <span className="rec-category">{proj.category}</span>
                        <span className="rec-match-score">{score}% Match</span>
                      </div>
                      <h4>{proj.title}</h4>
                      <p className="rec-desc">{proj.description.substring(0, 85)}...</p>
                      <div className="rec-bottom-row">
                        <span className="rec-budget">
                          {currency.format(proj.budgetMin ?? 0)} – {currency.format(proj.budgetMax ?? 0)}
                        </span>
                        <Link
                          to={`/projects?id=${proj.id}`}
                          className="primary-button rec-apply-btn"
                        >
                          Apply <ArrowUpRight size={13} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Recent Activity Feed */}
            <section className="dashboard-card activity-feed-card">
              <div className="card-header">
                <div>
                  <p className="card-eyebrow">TIMELINE</p>
                  <h2>Platform Activity</h2>
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
