import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import Navbar from "../components/Navbar";
import api, { getApiErrorMessage } from "../services/api";
import { getCurrentUser } from "../services/auth";
import type { Project } from "../types/project";
import type { Proposal } from "../types/proposal";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function budget(project: Project): string {
  if (project.budgetMin == null && project.budgetMax == null) return "Budget not set";
  if (project.budgetMin == null) return `Up to ${money.format(project.budgetMax!)}`;
  if (project.budgetMax == null) return `From ${money.format(project.budgetMin)}`;
  return `${money.format(project.budgetMin)} – ${money.format(project.budgetMax)}`;
}

export default function Projects() {
  const user = getCurrentUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [updatingProject, setUpdatingProject] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const [projectResponse, proposalResponse] = await Promise.all([
          api.get<Project[]>("/projects"),
          user?.role === "FREELANCER"
            ? api.get<Proposal[]>("/proposals/mine")
            : Promise.resolve({ data: [] as Proposal[] }),
        ]);
        if (active) {
          setProjects(projectResponse.data);
          setProposals(proposalResponse.data);
          setError("");
        }
      } catch (requestError: unknown) {
        if (active) {
          setError(getApiErrorMessage(requestError, "Unable to load projects."));
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [user?.role]);

  const visibleProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((project) =>
      [project.title, project.description, project.category ?? ""]
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [projects, search]);

  async function submitProposal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedProject === null) return;

    try {
      setSubmitting(true);
      const response = await api.post<Proposal>(
        `/projects/${selectedProject}/proposals`,
        {
          amount: Number(amount),
          deliveryDays: Number(deliveryDays),
          coverLetter,
        }
      );
      setProposals((current) => [response.data, ...current]);
      setSelectedProject(null);
      setAmount("");
      setDeliveryDays("");
      setCoverLetter("");
      setError("");
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError, "Unable to submit your proposal."));
    } finally {
      setSubmitting(false);
    }
  }

  async function updateProjectStatus(project: Project, status: "COMPLETED" | "CANCELLED") {
    try {
      setUpdatingProject(project.id);
      const response = await api.patch<Project>(`/projects/${project.id}/status`, { status });
      setProjects((current) => current.map((item) => item.id === project.id ? response.data : item));
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError, "Unable to update the project."));
    } finally {
      setUpdatingProject(null);
    }
  }

  return (
    <>
      <Navbar />
      <main className="dashboard-page">
        <div className="dashboard-header marketplace-heading">
          <div>
            <p className="eyebrow">UPLIFT MARKETPLACE</p>
            <h1>{user?.role === "CLIENT" ? "Your projects" : "Find your next project"}</h1>
            <p className="dashboard-description">
              {user?.role === "CLIENT"
                ? "Track your project posts and review proposals from freelancers."
                : "Explore real client projects and send a proposal that stands out."}
            </p>
          </div>
          {user?.role === "CLIENT" && (
            <Link className="post-project-button" to="/post-project">
              Post a project
            </Link>
          )}
        </div>

        <div className="marketplace-toolbar">
          <label htmlFor="project-search">Search projects</label>
          <input
            id="project-search"
            type="search"
            placeholder="Search title, category, or description"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {error && <div className="form-error marketplace-message" role="alert">{error}</div>}
        {loading ? (
          <p className="marketplace-message" role="status">Loading projects…</p>
        ) : visibleProjects.length === 0 ? (
          <div className="empty-state">
            <BriefcaseBusiness size={28} />
            <h2>{search ? "No projects match your search" : "No projects yet"}</h2>
            <p>{search ? "Try a different search term." : "New opportunities will appear here when clients post projects."}</p>
          </div>
        ) : (
          <div className="projects-grid">
            {visibleProjects.map((project) => {
              const existingProposal = proposals.find((proposal) => proposal.projectId === project.id);
              const composing = selectedProject === project.id;
              return (
                <article className="project-card marketplace-card" key={project.id}>
                  <div className="project-card-header">
                    <span className="project-category">{project.category || "General"}</span>
                    <span className={`status-pill status-${project.status.toLowerCase()}`}>
                      {project.status.replace("_", " ")}
                    </span>
                  </div>
                  <h3>{project.title}</h3>
                  <p className="project-card-description">{project.description}</p>
                  <div className="project-card-budget">{budget(project)}</div>
                  <p className="project-date">
                    Posted {new Date(project.createdAt).toLocaleDateString()}
                  </p>

                  {user?.role === "CLIENT" && project.status === "IN_PROGRESS" && (
                    <button
                      className="secondary-button project-state-button"
                      disabled={updatingProject === project.id}
                      onClick={() => void updateProjectStatus(project, "COMPLETED")}
                    >
                      {updatingProject === project.id ? "Saving…" : "Mark completed"}
                    </button>
                  )}
                  {user?.role === "CLIENT" && project.status === "OPEN" && (
                    <button
                      className="text-button project-state-button"
                      disabled={updatingProject === project.id}
                      onClick={() => void updateProjectStatus(project, "CANCELLED")}
                    >
                      Cancel project
                    </button>
                  )}

                  {user?.role === "FREELANCER" && (
                    existingProposal ? (
                      <p className="proposal-submitted">
                        Proposal {existingProposal.status.toLowerCase()}
                      </p>
                    ) : composing ? (
                      <form className="proposal-form" onSubmit={submitProposal}>
                        <label>
                          Your bid (₹)
                          <input
                            type="number"
                            min="1"
                            step="0.01"
                            required
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                          />
                        </label>
                        <label>
                          Delivery time (days)
                          <input
                            type="number"
                            min="1"
                            required
                            value={deliveryDays}
                            onChange={(event) => setDeliveryDays(event.target.value)}
                          />
                        </label>
                        <label>
                          Cover letter
                          <textarea
                            rows={4}
                            maxLength={3000}
                            required
                            value={coverLetter}
                            onChange={(event) => setCoverLetter(event.target.value)}
                          />
                        </label>
                        <div className="proposal-form-actions">
                          <button type="button" className="secondary-button" onClick={() => setSelectedProject(null)}>
                            Cancel
                          </button>
                          <button type="submit" className="primary-button" disabled={submitting}>
                            {submitting ? "Sending…" : "Send proposal"}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        className="primary-button proposal-open-button"
                        onClick={() => {
                          setSelectedProject(project.id);
                          setAmount(project.budgetMin?.toString() ?? "");
                          setError("");
                        }}
                      >
                        Submit proposal <ArrowUpRight size={17} />
                      </button>
                    )
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
