import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, CheckCircle2, Clock3, FileText } from "lucide-react";
import Navbar from "../components/Navbar";
import api, { getApiErrorMessage } from "../services/api";
import { getCurrentUser } from "../services/auth";
import type { DashboardStats, Proposal } from "../types/proposal";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function FreelancerDashboard() {
  const user = getCurrentUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      const [statsResponse, proposalsResponse] = await Promise.all([
        api.get<DashboardStats>("/dashboard"),
        api.get<Proposal[]>("/proposals/mine"),
      ]);
      setStats(statsResponse.data);
      setProposals(proposalsResponse.data);
      setError("");
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError, "Unable to load your dashboard."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return (
    <>
      <Navbar />
      <main className="dashboard-page">
        <div className="dashboard-header marketplace-heading">
          <div>
            <p className="eyebrow">FREELANCER WORKSPACE</p>
            <h1>Welcome, <span>{user?.name}</span></h1>
            <p className="dashboard-description">Find work that fits your skills and keep track of every proposal you send.</p>
          </div>
          <Link className="post-project-button" to="/projects">Browse projects</Link>
        </div>

        {error && <div className="form-error marketplace-message" role="alert">{error}</div>}
        <section className="stats-grid dashboard-metrics" aria-label="Freelancer statistics">
          <article className="stat-card"><BriefcaseBusiness /><div><strong>{loading ? "—" : stats?.openProjects ?? 0}</strong><span>Open projects</span></div></article>
          <article className="stat-card"><Clock3 /><div><strong>{loading ? "—" : stats?.inProgressProjects ?? 0}</strong><span>Active engagements</span></div></article>
          <article className="stat-card"><CheckCircle2 /><div><strong>{loading ? "—" : stats?.completedProjects ?? 0}</strong><span>Completed work</span></div></article>
          <article className="stat-card"><FileText /><div><strong>{loading ? "—" : stats?.totalProposals ?? 0}</strong><span>Proposals sent</span></div></article>
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <div><p className="eyebrow">YOUR ACTIVITY</p><h2>Recent proposals</h2></div>
            <Link to="/projects">Find more work</Link>
          </div>
          {loading ? (
            <p className="marketplace-message" role="status">Loading proposals…</p>
          ) : proposals.length === 0 ? (
            <div className="empty-state compact-empty">
              <FileText size={25} />
              <h3>Your next opportunity is waiting</h3>
              <p>Browse open projects and send your first proposal.</p>
              <Link className="primary-button" to="/projects">Browse open projects</Link>
            </div>
          ) : (
            <div className="proposal-list">
              {proposals.map((proposal) => (
                <article className="proposal-card proposal-row" key={proposal.id}>
                  <div>
                    <p className="card-eyebrow">{proposal.projectTitle}</p>
                    <p className="proposal-letter">{proposal.coverLetter}</p>
                    <div className="proposal-facts">
                      <strong>{currency.format(proposal.amount)}</strong>
                      <span>{proposal.deliveryDays} day delivery</span>
                      <span>Sent {new Date(proposal.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`status-pill status-${proposal.status.toLowerCase()}`}>{proposal.status}</span>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default FreelancerDashboard;
