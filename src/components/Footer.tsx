import { Link } from "react-router-dom";
import { ArrowUpRight, Github, Code2, Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="brand">
              <div className="brand-mark">U</div>
              <div>
                <div className="brand-name">UpLift</div>
                <div className="brand-tagline">Build. Connect. Grow.</div>
              </div>
            </Link>
            <p className="footer-description">
              UpLift connects emerging technology talent with startups, small businesses, and individuals to transform real-world problems into practical digital solutions.
            </p>
            <div className="footer-tagline-badge">
              <span>POST</span> → <span>MATCH</span> → <span>PROPOSE</span> → <span>BUILD</span> → <span>REVIEW</span>
            </div>
          </div>

          <div className="footer-nav-groups">
            <div className="footer-column">
              <h4>Marketplace</h4>
              <ul>
                <li><Link to="/projects">Explore Projects</Link></li>
                <li><Link to="/post-project">Post a Project</Link></li>
                <li><a href="/#how-it-works">How It Works</a></li>
                <li><a href="/#featured-projects">Featured Solutions</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>For Users</h4>
              <ul>
                <li><a href="/#for-freelancers">For Emerging Talent</a></li>
                <li><Link to="/dashboard">Client Dashboard</Link></li>
                <li><Link to="/dashboard">Freelancer Workspace</Link></li>
                <li><Link to="/login">Sign In / Demo Access</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Source & Links</h4>
              <ul>
                <li>
                  <a
                    href="https://github.com/Yeshwanth18-cmd/uplift-frontend"
                    target="_blank"
                    rel="noreferrer"
                    className="footer-external-link"
                  >
                    <Github size={14} /> Frontend Repo <ArrowUpRight size={12} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Yeshwanth18-cmd/uplift-backend"
                    target="_blank"
                    rel="noreferrer"
                    className="footer-external-link"
                  >
                    <Code2 size={14} /> Backend Repo <ArrowUpRight size={12} />
                  </a>
                </li>
                <li>
                  <span className="prototype-status-pill">
                    <Sparkles size={12} /> Frontend Prototype
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            © {new Date().getFullYear()} UpLift Marketplace. Service Marketplace for Emerging Tech Talent.
          </div>
          <div className="footer-note">
            Built with React & TypeScript <Heart size={12} className="heart-icon" /> Designed for direct Vercel deployment.
          </div>
        </div>
      </div>
    </footer>
  );
}
