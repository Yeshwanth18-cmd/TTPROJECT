# UpLift — Service Marketplace for Emerging Tech Talent

> **"POST A PROBLEM. FIND THE RIGHT TALENT. GET IT BUILT."**

UpLift is an AI-powered technology talent marketplace that connects emerging developers, students, and freelancers with startups, small businesses, and individuals to transform real-world problems into practical digital solutions.

This repository contains the complete, deployment-ready frontend prototype of UpLift, built with **React**, **Vite**, **TypeScript**, and **Lucide Icons**. It runs entirely standalone without requiring a live backend, database, or external API keys.

---

## 🌟 Key Features

### 1. Startup Landing Page (`/`)
- **Hero Section**: High-converting pitch, clear value metrics, and a custom CSS-rendered interface mockup showing an AI talent match (96%), developer card, and real-time proposal notification.
- **Workflow Pipeline**: Visual walkthrough of UpLift's core 5-step flow: `POST → MATCH → PROPOSE → BUILD → REVIEW`.
- **Platform Value Proposition**: AI skill matching, modern tech stacks, transparent INR pricing, and verified portfolio building.
- **Featured Projects**: Six realistic sample problems:
  - AI Customer Support Assistant (Python, FastAPI, LangChain)
  - E-commerce Website Development (React, TypeScript, Node.js)
  - Smart Expense Tracker (React Native, Firebase)
  - Automated Business Reporting (Python, Pandas, Docker)
  - College Event Management Platform (React, Node.js, MongoDB)
  - Machine Learning API Deployment (Docker, PyTorch, AWS)
- **Why UpLift**: Side-by-side comparison for Startups/Clients vs. Emerging Developers.
- **Site Footer**: Navigation links, GitHub repository references, and prototype notice.

### 2. Explore Projects Marketplace (`/projects`)
- **Real-Time Search**: Instant filtering across project titles, descriptions, categories, and required tech skills.
- **Multi-Faceted Filtering**:
  - Categories: *AI & Machine Learning*, *Web Development*, *App Development*, *Automation & Data*, *UI/UX Design*.
  - Tech Stacks: *React*, *Python*, *TypeScript*, *FastAPI*, *LangChain*, *Node.js*, *Docker*, etc.
  - Budget ranges: *Under ₹15,000*, *₹15,000 – ₹25,000*, *Above ₹25,000*.
  - Statuses: *Open*, *In Progress*, *Completed*.
- **Sorting**: Newest First, Budget High to Low, Budget Low to High.
- **Project Detail Modal**: Deep-linkable via `?id=<id>`, displaying full scope, budget in INR, timeline, deliverables checklist, and required tech stack.
- **Proposal Submission Flow**: Interactive modal with custom bid amount (₹ INR), delivery days, and cover letter. Saves to local browser storage with instant toast confirmation.

### 3. Dual Role Dashboards (`/dashboard`)
- **1-Click Role Switcher**: Easily toggle between the **Client** and **Freelancer** experiences from anywhere in the app via the navbar badge or dashboard header.
- **Client Workspace**:
  - Welcome banner with live KPI statistics (Posted Projects, In Progress, Completed, Incoming Proposals).
  - Received proposals inbox with **Accept** and **Decline** actions. Accepting a bid immediately transitions the project to *In Progress* and notifies competing bids.
  - Posted projects management with status controls (Cancel, Mark Completed).
  - AI talent recommendations and real-time platform activity timeline.
- **Freelancer Workspace**:
  - Verified talent profile card with bio, rating (4.9 ★), hourly rate, and core skill pills.
  - Opportunities KPIs (Open Projects, Active Engagements, Completed Work, Proposals Sent).
  - AI Match Engine: surfaces recommended opportunities scored by tech match (96%, 92%, etc.).
  - Submitted proposals tracker with status badges (*Pending*, *Accepted*, *Declined*).

### 4. Create Project (`/post-project`)
- Form validation for project title, category, description, required skills, timeline, and INR budget range.
- Deliverables checklist specification.
- Saves directly to browser `localStorage` and immediately updates the live marketplace.

### 5. Mock Demo Authentication (`/login` & `/register`)
- 1-Click demo logins for:
  - **Client**: Aakash Mehta (*TechCraft Labs Founder*)
  - **Freelancer**: Ananya Roy (*Full-Stack & AI Specialist*)
- Password visibility toggle (show/hide).
- Role selection tabs (*Hire Talent* vs. *Offer Services*).

---

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 7
- **Routing**: React Router v7 (`BrowserRouter` with `vercel.json` SPA rewrite)
- **Icons**: Lucide React
- **Styling**: Vanilla CSS with custom design tokens, modern cards, and responsive CSS Grid / Flexbox layouts
- **State & Persistence**: Local browser storage (`localStorage`) initialized with realistic seed data

---

## 🚀 Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Yeshwanth18-cmd/uplift-frontend.git
   cd uplift-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:5173](http://localhost:5173)

5. **Run production build test**:
   ```bash
   npm run build
   ```

---

## 🌐 Deploying to Vercel

This repository is pre-configured for direct zero-config Vercel deployment.

### Option A: Via GitHub (Recommended)
1. Push your updated code to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: complete polished UpLift mock website prototype"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** → **"Project"**.
4. Import your `uplift-frontend` repository.
5. In the project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: *None needed* (Pure standalone prototype)
6. Click **"Deploy"**. Your live public URL will be ready in under 60 seconds!

### Option B: Via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

> **Client-Side Routing Note**: The included `vercel.json` contains a rewrite rule (`/(.*) -> /index.html`) ensuring all routes (`/projects`, `/dashboard`, `/post-project`, etc.) resolve seamlessly on page refresh.

---

## 📄 License

MIT License — UpLift Service Marketplace.
