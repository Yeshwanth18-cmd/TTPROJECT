import { useEffect, useState } from "react";
import { BriefcaseBusiness, CheckCircle2, FileText, Users } from "lucide-react";
import Navbar from "../components/Navbar";
import api, { getApiErrorMessage } from "../services/api";
import { getCurrentUser } from "../services/auth";
import type { DashboardStats } from "../types/proposal";

function AdminDashboard() {
  const user = getCurrentUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.get<DashboardStats>("/dashboard")
      .then((response) => {
        if (active) setStats(response.data);
      })
      .catch((requestError: unknown) => {
        if (active) setError(getApiErrorMessage(requestError, "Unable to load platform statistics."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="dashboard-page">
        <div className="dashboard-header marketplace-heading">
          <div>
            <p className="eyebrow">PLATFORM OVERVIEW</p>
            <h1>Admin dashboard</h1>
            <p className="dashboard-description">Welcome, {user?.name}. Here is the current UpLift marketplace activity.</p>
          </div>
        </div>
        {error && <div className="form-error marketplace-message" role="alert">{error}</div>}
        <section className="stats-grid dashboard-metrics" aria-label="Platform statistics">
          <article className="stat-card"><Users /><div><strong>{loading ? "—" : stats?.totalUsers ?? 0}</strong><span>Registered users</span></div></article>
          <article className="stat-card"><BriefcaseBusiness /><div><strong>{loading ? "—" : stats?.totalProjects ?? 0}</strong><span>Total projects</span></div></article>
          <article className="stat-card"><CheckCircle2 /><div><strong>{loading ? "—" : stats?.inProgressProjects ?? 0}</strong><span>Active projects</span></div></article>
          <article className="stat-card"><FileText /><div><strong>{loading ? "—" : stats?.totalProposals ?? 0}</strong><span>Total proposals</span></div></article>
        </section>
        <section className="admin-summary-card">
          <div><span>Open projects</span><strong>{loading ? "—" : stats?.openProjects ?? 0}</strong></div>
          <div><span>Completed projects</span><strong>{loading ? "—" : stats?.completedProjects ?? 0}</strong></div>
          <div><span>Pending proposals</span><strong>{loading ? "—" : stats?.pendingProposals ?? 0}</strong></div>
          <div><span>Accepted proposals</span><strong>{loading ? "—" : stats?.acceptedProposals ?? 0}</strong></div>
        </section>
      </main>
    </>
  );
}

export default AdminDashboard;
