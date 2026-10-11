import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  BriefcaseBusiness,
  Clock,
  IndianRupee,
  X,
  CheckCircle2,
  Send,
  Sparkles,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCurrentUser } from "../services/auth";
import {
  getStoredProjects,
  getStoredProposals,
  createStoredProposal,
  updateStoredProjectStatus,
} from "../services/storage";
import type { Project, ProjectStatus } from "../types/project";
import type { Proposal } from "../types/proposal";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function budgetText(project: Project): string {
  if (project.budgetMin == null && project.budgetMax == null) return "Budget Indicative";
  if (project.budgetMin == null) return `Up to ${money.format(project.budgetMax!)}`;
  if (project.budgetMax == null) return `From ${money.format(project.budgetMin)}`;
  return `${money.format(project.budgetMin)} – ${money.format(project.budgetMax)}`;
}

const CATEGORIES = [
  "All",
  "AI & Machine Learning",
  "Web Development",
  "App Development",
  "Automation & Data",
  "UI/UX Design",
];

const POPULAR_TECHS = [
  "All",
  "React",
  "Python",
  "TypeScript",
  "FastAPI",
  "LangChain",
  "Node.js",
  "Docker",
  "Firebase",
];

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = getCurrentUser();

  const [projects, setProjects] = useState<Project[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTech, setSelectedTech] = useState("All");
  const [budgetRange, setBudgetRange] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Modals
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [proposalProject, setProposalProject] = useState<Project | null>(null);

  // Proposal form state
  const [bidAmount, setBidAmount] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("14");
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationToast, setConfirmationToast] = useState<string | null>(null);

  // Load data from localStorage
  const loadData = () => {
    const storedProjects = getStoredProjects();
    const storedProposals = getStoredProposals();
    setProjects(storedProjects);
    setProposals(storedProposals);

    // Deep link from URL: ?id=123
    const idParam = searchParams.get("id");
    if (idParam) {
      const match = storedProjects.find((p) => p.id === Number(idParam));
      if (match) {
        setDetailProject(match);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  // Handle URL param clear when closing modal
  const closeDetailModal = () => {
    setDetailProject(null);
    if (searchParams.has("id")) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("id");
      setSearchParams(nextParams);
    }
  };

  // Filtered & Sorted projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.skills && p.skills.some((s) => s.toLowerCase().includes(q)))
      );
    }

    // Category
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Technology
    if (selectedTech !== "All") {
      result = result.filter(
        (p) => p.skills && p.skills.some((s) => s.toLowerCase() === selectedTech.toLowerCase())
      );
    }

    // Budget range
    if (budgetRange === "under15k") {
      result = result.filter((p) => (p.budgetMax ?? 0) <= 15000);
    } else if (budgetRange === "15k-25k") {
      result = result.filter((p) => (p.budgetMax ?? 0) > 15000 && (p.budgetMin ?? 0) <= 25000);
    } else if (budgetRange === "above25k") {
      result = result.filter((p) => (p.budgetMax ?? 0) > 25000);
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter.toUpperCase());
    }

    // Sorting
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "budgetHigh") {
      result.sort((a, b) => (b.budgetMax ?? 0) - (a.budgetMax ?? 0));
    } else if (sortBy === "budgetLow") {
      result.sort((a, b) => (a.budgetMin ?? 0) - (b.budgetMin ?? 0));
    }

    return result;
  }, [projects, search, selectedCategory, selectedTech, budgetRange, statusFilter, sortBy]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedTech("All");
    setBudgetRange("all");
    setStatusFilter("all");
    setSortBy("newest");
  };

  const hasActiveFilters =
    search ||
    selectedCategory !== "All" ||
    selectedTech !== "All" ||
    budgetRange !== "all" ||
    statusFilter !== "all";

  // Proposal Submission
  const handleOpenProposal = (project: Project) => {
    setProposalProject(project);
    setBidAmount(project.budgetMin ? String(project.budgetMin) : "15000");
    setDeliveryDays("14");
    setCoverLetter(
      `Hi ${project.clientName || "there"}, I have hands-on experience building ${project.category || "tech"} solutions. I can deliver ${project.title} within the proposed timeline with clean, modular code and documentation.`
    );
  };

  const handleSubmitProposal = (e: FormEvent) => {
    e.preventDefault();
    if (!proposalProject) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const activeUser = getCurrentUser();
      createStoredProposal({
        projectId: proposalProject.id,
        projectTitle: proposalProject.title,
        freelancerId: activeUser?.userId || 201,
        freelancerName: activeUser?.name || "Ananya Roy",
        freelancerEmail: activeUser?.email || "ananya.dev@gmail.com",
        freelancerTitle: activeUser?.title || "Full-Stack Developer",
        amount: Number(bidAmount),
        deliveryDays: Number(deliveryDays),
        coverLetter,
      });

      setIsSubmitting(false);
      setProposalProject(null);
      setConfirmationToast(
        `Demo Proposal submitted successfully for "${proposalProject.title}" (₹${Number(bidAmount).toLocaleString()}). Saved in local browser demo state!`
      );
      loadData();

      setTimeout(() => {
        setConfirmationToast(null);
      }, 5000);
    }, 400);
  };

  const handleStatusChange = (project: Project, newStatus: ProjectStatus) => {
    updateStoredProjectStatus(project.id, newStatus);
    loadData();
    if (detailProject && detailProject.id === project.id) {
      setDetailProject({ ...detailProject, status: newStatus });
    }
  };

  return (
    <div className="marketplace-page-wrapper">
      <Navbar />

      <main className="projects-page">
        {/* Header */}
        <div className="projects-header">
          <div>
            <p className="eyebrow">EXPLORE UPLIFT MARKETPLACE</p>
            <h1>Browse Technical Problems & Projects</h1>
            <p className="projects-subheading">
              Discover real-world challenges posted by startups, founders, and small teams. Propose solutions or post your own challenge.
            </p>
          </div>

          <div className="header-actions-group">
            <Link to="/post-project" className="primary-button">
              <BriefcaseBusiness size={16} />
              Post a Project
            </Link>
          </div>
        </div>

        {/* Toast confirmation */}
        {confirmationToast && (
          <div className="demo-confirmation-toast" role="alert">
            <Sparkles size={18} />
            <div>
              <strong>Prototype Demonstration Confirmation</strong>
              <p>{confirmationToast}</p>
            </div>
            <button
              onClick={() => setConfirmationToast(null)}
              className="toast-close-btn"
              aria-label="Close message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Toolbar & Search */}
        <div className="marketplace-controls-card">
          <div className="search-and-sort-row">
            <div className="search-box">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search by keywords, tech stack (e.g. Python, React), or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="clear-search-btn" onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="filter-dropdown-group">
              <div className="select-wrapper">
                <SlidersHorizontal size={14} className="select-icon" />
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Budget Ranges</option>
                  <option value="under15k">Under ₹15,000</option>
                  <option value="15k-25k">₹15,000 – ₹25,000</option>
                  <option value="above25k">Above ₹25,000</option>
                </select>
              </div>

              <div className="select-wrapper">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="select-wrapper">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="budgetHigh">Budget: High to Low</option>
                  <option value="budgetLow">Budget: Low to High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="category-pills-row">
            <span className="filter-row-label">Category:</span>
            <div className="pills-scroll">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tech Stack Pills */}
          <div className="tech-pills-row">
            <span className="filter-row-label">Tech Stack:</span>
            <div className="pills-scroll">
              {POPULAR_TECHS.map((tech) => (
                <button
                  key={tech}
                  className={`tech-chip-pill ${selectedTech === tech ? "active" : ""}`}
                  onClick={() => setSelectedTech(tech)}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* Filter summary & Reset */}
          {hasActiveFilters && (
            <div className="active-filters-bar">
              <span>Showing {filteredProjects.length} filtered results</span>
              <button onClick={handleResetFilters} className="reset-filters-btn">
                <RotateCcw size={13} /> Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="empty-state">
            <BriefcaseBusiness size={32} />
            <h2>No projects match your filters</h2>
            <p>Try clearing your search query or adjusting your category/budget filters.</p>
            <button className="primary-button" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => {
              const myProposal = proposals.find(
                (p) => p.projectId === project.id && p.freelancerId === user?.userId
              );
              const isOwner = user?.role === "CLIENT" && project.clientId === user?.userId;

              return (
                <article className="project-card marketplace-card" key={project.id}>
                  <div className="project-card-header">
                    <span className="project-category">{project.category || "General"}</span>
                    <span className={`status-pill status-${project.status.toLowerCase()}`}>
                      {project.status.replace("_", " ")}
                    </span>
                  </div>

                  <h3
                    className="project-card-title-clickable"
                    onClick={() => setDetailProject(project)}
                  >
                    {project.title}
                  </h3>

                  <p className="project-card-description">{project.description}</p>

                  {/* Skills tags */}
                  {project.skills && project.skills.length > 0 && (
                    <div className="project-skills-list">
                      {project.skills.map((skill) => (
                        <span
                          key={skill}
                          className="skill-chip"
                          onClick={() => setSelectedTech(skill)}
                          title={`Filter by ${skill}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="project-card-meta-bottom">
                    <div className="project-card-budget">{budgetText(project)}</div>
                    <div className="project-card-duration">
                      <Clock size={13} />
                      <span>{project.duration || "2-3 weeks"}</span>
                    </div>
                  </div>

                  <div className="project-footer-meta">
                    <span className="client-name-meta">
                      Posted by <strong>{project.clientName || "Client"}</strong>
                    </span>
                    <span className="proposals-count-meta">
                      {project.proposalsCount || 0} proposals
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="marketplace-card-actions">
                    <button
                      className="secondary-button card-detail-btn"
                      onClick={() => setDetailProject(project)}
                    >
                      <Eye size={15} /> Details
                    </button>

                    {myProposal ? (
                      <span className={`applied-badge status-${myProposal.status.toLowerCase()}`}>
                        ✓ Proposal {myProposal.status.toLowerCase()}
                      </span>
                    ) : isOwner ? (
                      <div className="owner-status-actions">
                        {project.status === "OPEN" && (
                          <button
                            className="text-button"
                            onClick={() => handleStatusChange(project, "CANCELLED")}
                          >
                            Cancel
                          </button>
                        )}
                        {project.status === "IN_PROGRESS" && (
                          <button
                            className="secondary-button"
                            onClick={() => handleStatusChange(project, "COMPLETED")}
                          >
                            Mark Done
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        className="primary-button card-apply-btn"
                        onClick={() => handleOpenProposal(project)}
                      >
                        Apply Now <ArrowRight size={15} />
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* PROJECT DETAIL MODAL */}
      {detailProject && (
        <div className="modal-backdrop" onClick={closeDetailModal}>
          <div className="modal-card project-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-eyebrow-row">
                <span className="project-category">{detailProject.category || "General"}</span>
                <span className={`status-pill status-${detailProject.status.toLowerCase()}`}>
                  {detailProject.status.replace("_", " ")}
                </span>
              </div>
              <h2>{detailProject.title}</h2>
              <p className="detail-client-info">
                Posted by <strong>{detailProject.clientName || "TechCraft Labs"}</strong> •{" "}
                {new Date(detailProject.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <button
                className="modal-close-icon-btn"
                onClick={closeDetailModal}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Highlight Metrics */}
              <div className="detail-metrics-grid">
                <div className="detail-metric-card">
                  <IndianRupee size={16} className="metric-icon" />
                  <div>
                    <span>Indicative Budget</span>
                    <strong>{budgetText(detailProject)}</strong>
                  </div>
                </div>
                <div className="detail-metric-card">
                  <Clock size={16} className="metric-icon" />
                  <div>
                    <span>Estimated Timeline</span>
                    <strong>{detailProject.duration || "2–3 weeks"}</strong>
                  </div>
                </div>
                <div className="detail-metric-card">
                  <BriefcaseBusiness size={16} className="metric-icon" />
                  <div>
                    <span>Proposals Received</span>
                    <strong>{detailProject.proposalsCount || 0} active bids</strong>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="detail-section">
                <h4>Project Scope & Description</h4>
                <p className="detail-description-text">{detailProject.description}</p>
              </div>

              {/* Required Skills */}
              {detailProject.skills && detailProject.skills.length > 0 && (
                <div className="detail-section">
                  <h4>Required Technologies & Skills</h4>
                  <div className="skill-tags">
                    {detailProject.skills.map((skill) => (
                      <span key={skill} className="skill-chip-large">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Deliverables */}
              {detailProject.deliverables && detailProject.deliverables.length > 0 && (
                <div className="detail-section">
                  <h4>Expected Deliverables</h4>
                  <ul className="deliverables-list">
                    {detailProject.deliverables.map((del, i) => (
                      <li key={i}>
                        <CheckCircle2 size={15} className="deliverable-check" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="secondary-button" onClick={closeDetailModal}>
                Close
              </button>
              <button
                className="primary-button"
                onClick={() => {
                  const target = detailProject;
                  closeDetailModal();
                  handleOpenProposal(target);
                }}
              >
                Apply for this Project <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROPOSAL SUBMISSION MODAL */}
      {proposalProject && (
        <div className="modal-backdrop" onClick={() => setProposalProject(null)}>
          <div className="modal-card proposal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-eyebrow-row">
                <span className="eyebrow">DEMO PROPOSAL SUBMISSION</span>
              </div>
              <h2>Submit Proposal for {proposalProject.title}</h2>
              <p className="modal-sub">
                Client: {proposalProject.clientName} • Budget: {budgetText(proposalProject)}
              </p>
              <button
                className="modal-close-icon-btn"
                onClick={() => setProposalProject(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitProposal}>
              <div className="modal-body">
                <div className="prototype-hint-box">
                  <Sparkles size={16} />
                  <span>
                    <strong>Prototype Mode:</strong> This proposal will be saved locally to browser storage and will immediately show up in the Client's and Freelancer's dashboards.
                  </span>
                </div>

                <div className="form-row-2col">
                  <div className="form-group">
                    <label htmlFor="bid-amount">Your Bid (₹ INR) *</label>
                    <input
                      id="bid-amount"
                      type="number"
                      min="1000"
                      step="500"
                      required
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="e.g. 20000"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="delivery-days">Delivery Timeline (Days) *</label>
                    <input
                      id="delivery-days"
                      type="number"
                      min="1"
                      max="180"
                      required
                      value={deliveryDays}
                      onChange={(e) => setDeliveryDays(e.target.value)}
                      placeholder="e.g. 14"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="cover-letter">Cover Letter & Approach *</label>
                  <textarea
                    id="cover-letter"
                    rows={5}
                    required
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Explain your approach, why you're a good fit, relevant technologies you've worked with, and when you can start..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setProposalProject(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting Proposal..." : "Send Proposal"} <Send size={15} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
