import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  BriefcaseBusiness,
  Bot,
  Zap,
  Users,
  ShieldCheck,
  TrendingUp,
  Clock,
  IndianRupee,
  Layers,
  ArrowUpRight,
  Code2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getStoredProjects } from "../services/storage";
import type { Project } from "../types/project";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function LandingPage() {
  const navigate = useNavigate();
  const allProjects = getStoredProjects();
  // Take top 6 projects
  const featuredProjects = allProjects.slice(0, 6);

  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  const workflowSteps = [
    {
      num: "01",
      title: "Post Your Problem",
      desc: "Describe your requirements, timeline, and INR budget in minutes. Whether it's an AI chatbot, MVP app, or data script.",
      badge: "POST",
    },
    {
      num: "02",
      title: "Discover the Right Talent",
      desc: "Our AI match engine evaluates skills and portfolio projects to surface ambitious developers tailored to your tech stack.",
      badge: "MATCH",
    },
    {
      num: "03",
      title: "Collaborate & Propose",
      desc: "Receive structured proposals with detailed timelines and transparent milestones. Chat directly before kicking off.",
      badge: "PROPOSE",
    },
    {
      num: "04",
      title: "Build in Iterations",
      desc: "Work closely with your developer. Track progress via milestone check-ins, git repositories, and staging previews.",
      badge: "BUILD",
    },
    {
      num: "05",
      title: "Review & Complete",
      desc: "Review final deliverables, verify deployment, and release completion confirmation with verified developer ratings.",
      badge: "REVIEW",
    },
  ];

  return (
    <div className="landing-page-wrapper">
      <Navbar />

      {/* HERO SECTION */}
      <section className="landing-hero-section">
        <div className="landing-container hero-grid">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="eyebrow-pill">
                <Sparkles size={13} />
                THE NEXT GENERATION OF TECH TALENT
              </span>
            </div>

            <h1 className="hero-headline">
              Your next big idea deserves the <span>right talent</span>.
            </h1>

            <p className="hero-supporting-text">
              From AI-powered solutions to full-stack applications, discover emerging developers ready to turn your challenges into real products.
            </p>

            <div className="hero-cta-group">
              <Link to="/projects" className="primary-button hero-primary-btn">
                <BriefcaseBusiness size={18} />
                Explore Projects
                <ArrowRight size={16} />
              </Link>
              <Link to="/post-project" className="secondary-button hero-secondary-btn">
                Post a Project
              </Link>
            </div>

            <div className="hero-trust-metrics">
              <div className="trust-item">
                <CheckCircle2 size={16} className="trust-icon" />
                <span>Verified Emerging Developers</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={16} className="trust-icon" />
                <span>Transparent INR Pricing</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={16} className="trust-icon" />
                <span>Zero Platform Lock-in</span>
              </div>
            </div>
          </div>

          {/* CUSTOM UI MOCKUP PREVIEW */}
          <div className="hero-mockup-wrapper">
            <div className="mockup-window">
              <div className="mockup-window-bar">
                <div className="mockup-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <div className="mockup-address-bar">
                  uplift.market/explore-ai-match
                </div>
              </div>

              <div className="mockup-content">
                {/* Active Match Card */}
                <div className="mockup-match-card">
                  <div className="mockup-match-header">
                    <div className="talent-avatar-badge">AR</div>
                    <div>
                      <div className="mockup-talent-name">
                        Ananya Roy <span className="verified-badge">✓ Verified</span>
                      </div>
                      <div className="mockup-talent-role">Full-Stack & AI Specialist</div>
                    </div>
                    <div className="ai-match-pill">
                      <Sparkles size={12} />
                      96% Match
                    </div>
                  </div>

                  <div className="mockup-tags">
                    <span>Python</span>
                    <span>LangChain</span>
                    <span>FastAPI</span>
                    <span>React</span>
                  </div>

                  <div className="mockup-quote">
                    "Built 3 production RAG chatbots with streaming vector search."
                  </div>
                </div>

                {/* Active Problem Project Snapshot */}
                <div className="mockup-project-card">
                  <div className="mockup-project-header">
                    <span className="category-tag">AI & Machine Learning</span>
                    <span className="status-pill status-open">Active Problem</span>
                  </div>
                  <h4>AI Customer Support Assistant</h4>
                  <p>Autonomous LLM support assistant with knowledge-base retrieval.</p>
                  <div className="mockup-project-meta">
                    <div className="meta-item">
                      <IndianRupee size={14} />
                      <strong>₹18,000 – ₹28,000</strong>
                    </div>
                    <div className="meta-item">
                      <Clock size={14} />
                      <span>2–3 weeks</span>
                    </div>
                  </div>
                </div>

                {/* Live Floating Notification */}
                <div className="mockup-floating-toast">
                  <div className="toast-icon-box">
                    <Zap size={14} />
                  </div>
                  <div>
                    <strong>Proposal Received</strong>
                    <span>Ananya submitted: ₹22,000 (14 days)</span>
                  </div>
                  <span className="toast-time">Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE WORKFLOW BANNER */}
      <section className="workflow-strip">
        <div className="landing-container">
          <div className="workflow-flow-badges">
            <span className="workflow-step-pill">POST</span>
            <span className="workflow-arrow">→</span>
            <span className="workflow-step-pill active">MATCH</span>
            <span className="workflow-arrow">→</span>
            <span className="workflow-step-pill">PROPOSE</span>
            <span className="workflow-arrow">→</span>
            <span className="workflow-step-pill">BUILD</span>
            <span className="workflow-arrow">→</span>
            <span className="workflow-step-pill">REVIEW</span>
          </div>
          <p className="workflow-tagline-text">
            "POST A PROBLEM. FIND THE RIGHT TALENT. GET IT BUILT."
          </p>
        </div>
      </section>

      {/* VALUE PROPOSITION SECTION */}
      <section className="value-prop-section">
        <div className="landing-container">
          <div className="section-title-center">
            <p className="eyebrow">PLATFORM VALUE PROPOSITION</p>
            <h2>Built for modern builders and forward-thinking businesses</h2>
            <p className="section-subheading">
              UpLift bridges the gap between companies seeking agile technical solutions and talented emerging developers eager to ship real-world code.
            </p>
          </div>

          <div className="value-props-grid">
            <div className="value-card">
              <div className="value-icon-box">
                <Bot size={24} />
              </div>
              <h3>AI-Powered Talent Matching</h3>
              <p>
                No endless scrolling through outdated resumes. UpLift semantic matching pairs your exact requirements and stack with developers who have proven domain competence.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon-box">
                <Code2 size={24} />
              </div>
              <h3>Emerging Tech Stacks</h3>
              <p>
                Our talent community builds with cutting-edge technologies: Next.js, FastAPI, PyTorch, LangChain, Tailwind CSS, Docker, and TypeScript.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon-box">
                <ShieldCheck size={24} />
              </div>
              <h3>Practical INR Pricing</h3>
              <p>
                Get high-quality digital solutions at rates that work for early-stage startups, small business founders, and individual creators.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon-box">
                <TrendingUp size={24} />
              </div>
              <h3>Real-World Experience</h3>
              <p>
                Freelancers gain verified portfolio proof, direct client recommendations, and tangible delivery credentials instead of theoretical coursework.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="landing-container">
          <div className="section-title-center">
            <p className="eyebrow">SEAMLESS PROCESS</p>
            <h2>How UpLift Works</h2>
            <p className="section-subheading">
              From defining your challenge to shipping the finished product in five transparent steps.
            </p>
          </div>

          <div className="workflow-stepper-grid">
            {workflowSteps.map((step, idx) => (
              <div
                key={step.num}
                className={`step-card ${activeWorkflowStep === idx ? "active" : ""}`}
                onClick={() => setActiveWorkflowStep(idx)}
              >
                <div className="step-card-top">
                  <span className="step-number">{step.num}</span>
                  <span className="step-badge">{step.badge}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS SECTION */}
      <section id="featured-projects" className="featured-projects-section">
        <div className="landing-container">
          <div className="featured-section-header">
            <div>
              <p className="eyebrow">ACTIVE MARKETPLACE PROBLEMS</p>
              <h2>Featured Opportunities</h2>
              <p className="section-subheading">
                Explore sample projects posted by startups and businesses across India.
              </p>
            </div>
            <Link to="/projects" className="secondary-button view-all-projects-btn">
              Explore All Projects <ArrowRight size={15} />
            </Link>
          </div>

          <div className="projects-grid">
            {featuredProjects.map((project) => (
              <article key={project.id} className="project-card marketplace-card landing-project-card">
                <div className="project-card-header">
                  <span className="project-category">{project.category || "General"}</span>
                  <span className={`status-pill status-${project.status.toLowerCase()}`}>
                    {project.status.replace("_", " ")}
                  </span>
                </div>

                <h3>{project.title}</h3>
                <p className="project-card-description">{project.description}</p>

                {project.skills && project.skills.length > 0 && (
                  <div className="project-skills-list">
                    {project.skills.map((skill) => (
                      <span key={skill} className="skill-chip">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="project-card-meta-bottom">
                  <div className="project-card-budget">
                    {project.budgetMin != null && project.budgetMax != null
                      ? `${currency.format(project.budgetMin)} – ${currency.format(project.budgetMax)}`
                      : "Budget Indicative"}
                    <span> INR</span>
                  </div>
                  <div className="project-card-duration">
                    <Clock size={13} />
                    <span>{project.duration || "2-3 weeks"}</span>
                  </div>
                </div>

                <div className="card-actions-row">
                  <button
                    className="primary-button project-view-btn"
                    onClick={() => navigate(`/projects?id=${project.id}`)}
                  >
                    View Project <ArrowUpRight size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="sample-disclaimer-banner">
            <Sparkles size={16} />
            <span>
              Sample live projects running in the interactive UpLift prototype. You can apply, propose bids, or post your own project in real time.
            </span>
          </div>
        </div>
      </section>

      {/* WHY UPLIFT (FOR CLIENTS & FREELANCERS) */}
      <section id="for-freelancers" className="why-uplift-section">
        <div className="landing-container">
          <div className="section-title-center">
            <p className="eyebrow">TWO SIDES, ONE MARKETPLACE</p>
            <h2>Why Choose UpLift?</h2>
            <p className="section-subheading">
              Built to empower both technical service buyers and the next wave of ambitious developers.
            </p>
          </div>

          <div className="dual-audience-grid">
            {/* For Clients */}
            <div className="audience-column client-column">
              <div className="audience-badge">
                <BriefcaseBusiness size={18} />
                <span>FOR CLIENTS & STARTUPS</span>
              </div>
              <h3>Ship faster with motivated emerging developers</h3>
              <ul className="benefits-checklist">
                <li>
                  <CheckCircle2 size={17} className="check-icon" />
                  <div>
                    <strong>Practical, accessible pricing</strong>
                    <p>Transparent budgets in INR without expensive middleman retainers or agency bloat.</p>
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={17} className="check-icon" />
                  <div>
                    <strong>AI skill matching</strong>
                    <p>Find developers whose verified projects and coursework align with your exact needs.</p>
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={17} className="check-icon" />
                  <div>
                    <strong>Agile iteration</strong>
                    <p>Direct communication, frequent milestone updates, and clear deliverables.</p>
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={17} className="check-icon" />
                  <div>
                    <strong>Full IP ownership</strong>
                    <p>All created code, assets, and repositories belong entirely to your company.</p>
                  </div>
                </li>
              </ul>
              <Link to="/post-project" className="primary-button audience-cta">
                Post Your Problem Today
              </Link>
            </div>

            {/* For Freelancers */}
            <div className="audience-column freelancer-column">
              <div className="audience-badge freelancer-badge">
                <Users size={18} />
                <span>FOR FREELANCERS & STUDENTS</span>
              </div>
              <h3>Turn learning into practical digital solutions</h3>
              <ul className="benefits-checklist">
                <li>
                  <CheckCircle2 size={17} className="check-icon" />
                  <div>
                    <strong>Real client project portfolio</strong>
                    <p>Ditch generic mock apps. Build real solutions that solve genuine business problems.</p>
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={17} className="check-icon" />
                  <div>
                    <strong>Earn competitive compensation</strong>
                    <p>Fair, transparent compensation directly tied to delivered project milestones.</p>
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={17} className="check-icon" />
                  <div>
                    <strong>Build client reputation</strong>
                    <p>Collect verified ratings and client reviews to jumpstart your engineering career.</p>
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={17} className="check-icon" />
                  <div>
                    <strong>Apply with custom proposals</strong>
                    <p>Showcase your problem-solving capability with clear proposals and delivery timelines.</p>
                  </div>
                </li>
              </ul>
              <Link to="/projects" className="secondary-button audience-cta">
                Browse Open Opportunities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="landing-cta-section">
        <div className="landing-container">
          <div className="cta-banner-box">
            <p className="eyebrow cta-eyebrow">START BUILDING TODAY</p>
            <h2>Your next opportunity starts here.</h2>
            <p className="cta-description">
              Whether you need an AI-powered solution, a mobile app, or you are an emerging developer ready to build—UpLift brings both worlds together.
            </p>
            <div className="cta-buttons-row">
              <Link to="/projects" className="primary-button cta-primary-btn">
                Explore Projects
                <ArrowRight size={17} />
              </Link>
              <Link to="/post-project" className="secondary-button cta-secondary-btn">
                Post a Project
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
