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

function ClientDashboard() {
  const user = getCurrentUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyProposal, setBusyProposal] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      const [statsResponse, proposalsResponse] = await Promise.all([
        api.get<DashboardStats>("/dashboard"),
        api.get<Proposal[]>("/proposals/inbox"),
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

  async function decideProposal(proposalId: number, status: "ACCEPTED" | "REJECTED") {
    try {
      setBusyProposal(proposalId);
      const response = await api.patch<Proposal>(`/proposals/${proposalId}/status`, { status });
      setProposals((current) =>
        current.map((proposal) =>
          proposal.id === proposalId
            ? response.data
            : status === "ACCEPTED" && proposal.projectId === response.data.projectId && proposal.status === "PENDING"
              ? { ...proposal, status: "REJECTED" }
              : proposal
        )
      );
      await loadDashboard();
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError, "Unable to update this proposal."));
    } finally {
      setBusyProposal(null);
    }
  }

  return (
    <>
      <Navbar />
      <main className="dashboard-page">
        <div className="dashboard-header marketplace-heading">
          <div>
            <p className="eyebrow">CLIENT WORKSPACE</p>
            <h1>Welcome, <span>{user?.name}</span></h1>
            <p className="dashboard-description">Manage your project posts and choose the right freelancer for your work.</p>
          </div>
          <Link className="post-project-button" to="/post-project">Post a project</Link>
        </div>

        {error && <div className="form-error marketplace-message" role="alert">{error}</div>}
        <section className="stats-grid dashboard-metrics" aria-label="Project statistics">
          <article className="stat-card"><BriefcaseBusiness /><div><strong>{loading ? "—" : stats?.totalProjects ?? 0}</strong><span>Posted projects</span></div></article>
          <article className="stat-card"><Clock3 /><div><strong>{loading ? "—" : stats?.inProgressProjects ?? 0}</strong><span>In progress</span></div></article>
          <article className="stat-card"><CheckCircle2 /><div><strong>{loading ? "—" : stats?.completedProjects ?? 0}</strong><span>Completed</span></div></article>
          <article className="stat-card"><FileText /><div><strong>{loading ? "—" : stats?.pendingProposals ?? 0}</strong><span>New proposals</span></div></article>
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <div><p className="eyebrow">INCOMING</p><h2>Freelancer proposals</h2></div>
            <Link to="/projects">View your projects</Link>
          </div>
          {loading ? (
            <p className="marketplace-message" role="status">Loading proposals…</p>
          ) : proposals.length === 0 ? (
            <div className="empty-state compact-empty">
              <FileText size={25} />
              <h3>No proposals yet</h3>
              <p>When freelancers respond to your projects, you can review them here.</p>
            </div>
          ) : (
            <div className="proposal-list">
              {proposals.map((proposal) => (
                <article className="proposal-card" key={proposal.id}>
                  <div className="proposal-card-heading">
                    <div>
                      <p className="card-eyebrow">{proposal.projectTitle}</p>
                      <h3>{proposal.freelancerName}</h3>
                      <a href={`mailto:${proposal.freelancerEmail}`}>{proposal.freelancerEmail}</a>
                    </div>
                    <span className={`status-pill status-${proposal.status.toLowerCase()}`}>{proposal.status}</span>
                  </div>
                  <div className="proposal-facts">
                    <strong>{currency.format(proposal.amount)}</strong>
                    <span>{proposal.deliveryDays} day delivery</span>
                    <span>Received {new Date(proposal.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="proposal-letter">{proposal.coverLetter}</p>
                  {proposal.status === "PENDING" && (
                    <div className="proposal-actions">
                      <button className="secondary-button" disabled={busyProposal === proposal.id} onClick={() => void decideProposal(proposal.id, "REJECTED")}>
                        Decline
                      </button>
                      <button className="primary-button" disabled={busyProposal === proposal.id} onClick={() => void decideProposal(proposal.id, "ACCEPTED")}>
                        {busyProposal === proposal.id ? "Saving…" : "Accept proposal"}
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default ClientDashboard;
