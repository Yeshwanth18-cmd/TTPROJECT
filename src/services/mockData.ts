import type { Project } from "../types/project";
import type { Proposal, DashboardStats } from "../types/proposal";
import type { CurrentUser } from "./auth";

export interface TalentProfile {
  id: number;
  name: string;
  avatarText: string;
  title: string;
  bio: string;
  rating: number;
  completedJobs: number;
  hourlyRate: number;
  matchScore: number;
  skills: string[];
  location: string;
  verified: boolean;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: "project" | "proposal" | "match" | "completion";
}

export const INITIAL_USERS: CurrentUser[] = [
  {
    userId: 101,
    name: "Aakash Mehta",
    email: "aakash@techcraft.in",
    role: "CLIENT",
  },
  {
    userId: 201,
    name: "Ananya Roy",
    email: "ananya.dev@gmail.com",
    role: "FREELANCER",
  },
  {
    userId: 1,
    name: "UpLift Admin",
    email: "admin@upliftmarket.in",
    role: "ADMIN",
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    title: "AI Customer Support Assistant",
    category: "AI & Machine Learning",
    description: "Build an intelligent customer support chatbot capable of querying our product docs via vector search, answering customer queries with streaming responses, and escalating complex issues to human agents.",
    skills: ["Python", "FastAPI", "LangChain", "OpenAI", "React"],
    budgetMin: 18000,
    budgetMax: 28000,
    duration: "2-3 weeks",
    status: "OPEN",
    createdAt: "2026-10-08T10:30:00Z",
    clientId: 101,
    clientName: "TechCraft Labs",
    deliverables: [
      "FastAPI backend with vector database integration (Chroma / Pinecone)",
      "Embeddable React chat widget with markdown and code block support",
      "Admin interface to upload, update, and re-index knowledge docs",
      "Comprehensive API documentation and test coverage"
    ],
    proposalsCount: 3,
  },
  {
    id: 2,
    title: "E-commerce Website Development",
    category: "Web Development",
    description: "Develop a modern, high-converting digital storefront for an artisanal Indian handicraft brand with dynamic catalog filtering, cart persistence, Razorpay payment gateway, and order confirmation emails.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"],
    budgetMin: 24000,
    budgetMax: 36000,
    duration: "3-4 weeks",
    status: "IN_PROGRESS",
    createdAt: "2026-10-06T14:15:00Z",
    clientId: 101,
    clientName: "TechCraft Labs",
    deliverables: [
      "Responsive, mobile-first product catalog and product detail pages",
      "Persistent cart and guest/authenticated checkout flow",
      "Razorpay webhook integration with automated invoice emails",
      "Merchant dashboard for inventory, orders, and sales metrics"
    ],
    proposalsCount: 5,
  },
  {
    id: 3,
    title: "Smart Expense Tracker",
    category: "App Development",
    description: "Design and code a cross-platform mobile application that categorizes personal and freelance expenses, tracks monthly budgets, detects recurring subscriptions, and generates visual spending insights.",
    skills: ["React Native", "TypeScript", "Firebase", "Chart.js"],
    budgetMin: 14000,
    budgetMax: 22000,
    duration: "2 weeks",
    status: "OPEN",
    createdAt: "2026-10-07T09:00:00Z",
    clientId: 102,
    clientName: "Karan Singhania",
    deliverables: [
      "Cross-platform React Native app (Android & iOS)",
      "Offline first data persistence with Firebase cloud sync",
      "Interactive analytics charts for category-wise spend breakdowns",
      "One-click monthly PDF/CSV expense report export"
    ],
    proposalsCount: 2,
  },
  {
    id: 4,
    title: "Automated Business Reporting",
    category: "Automation & Data",
    description: "Create an automated reporting pipeline that pulls daily transaction data from our POS and CRM APIs, reconciles discrepancies, builds clean Excel/Google Sheet reports, and triggers daily Slack/Email summaries.",
    skills: ["Python", "Pandas", "Google Sheets API", "Docker", "Automation"],
    budgetMin: 12000,
    budgetMax: 18000,
    duration: "1-2 weeks",
    status: "OPEN",
    createdAt: "2026-10-09T16:45:00Z",
    clientId: 103,
    clientName: "GreenVibe Organics",
    deliverables: [
      "Robust Python ETL pipeline with retry logic and error logging",
      "Automated Google Sheets dashboard formatting and formulas",
      "Scheduled Docker cron runner with webhook alerts",
      "Clear deployment readme and setup script"
    ],
    proposalsCount: 4,
  },
  {
    id: 5,
    title: "College Event Management Platform",
    category: "Web Development",
    description: "Build a unified campus event registration portal featuring digital ticketing, QR-code check-ins, team formation boards, schedule tracks, and instant announcements for university cultural fests.",
    skills: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    budgetMin: 15000,
    budgetMax: 24000,
    duration: "2-3 weeks",
    status: "OPEN",
    createdAt: "2026-10-10T11:20:00Z",
    clientId: 104,
    clientName: "Nexus Student Council",
    deliverables: [
      "Student event catalog with registration and ticket issuance",
      "Fast QR scanner interface for on-ground event volunteers",
      "Real-time event announcements and live updates feed",
      "Admin analytics showing seat capacity and attendance rates"
    ],
    proposalsCount: 3,
  },
  {
    id: 6,
    title: "Machine Learning API Deployment",
    category: "AI & Machine Learning",
    description: "Package and deploy a trained PyTorch computer vision model into a containerized microservice on AWS ECS with auto-scaling, latency monitoring, and automated test pipelines.",
    skills: ["Docker", "PyTorch", "FastAPI", "AWS", "CI/CD"],
    budgetMin: 20000,
    budgetMax: 32000,
    duration: "2 weeks",
    status: "OPEN",
    createdAt: "2026-10-11T08:00:00Z",
    clientId: 101,
    clientName: "TechCraft Labs",
    deliverables: [
      "High-throughput FastAPI inference endpoint (<150ms latency)",
      "Multi-stage Dockerfile optimized for low memory footprint",
      "GitHub Actions workflow for automated test, build, and deploy",
      "CloudWatch monitoring metrics and health check probes"
    ],
    proposalsCount: 2,
  },
  {
    id: 7,
    title: "SaaS Landing Page & Brand Design",
    category: "UI/UX Design",
    description: "Craft a high-converting, interactive marketing site for a developer productivity tool with dark mode, interactive component demos, testimonial highlights, and clean typography.",
    skills: ["Figma", "React", "TypeScript", "Tailwind CSS"],
    budgetMin: 12000,
    budgetMax: 18000,
    duration: "1-2 weeks",
    status: "COMPLETED",
    createdAt: "2026-10-01T12:00:00Z",
    clientId: 101,
    clientName: "TechCraft Labs",
    deliverables: [
      "Figma design system and component spec",
      "Production-ready responsive React code",
      "Interactive product feature preview widgets",
      "Lighthouse 98+ score on Performance and SEO"
    ],
    proposalsCount: 6,
  },
  {
    id: 8,
    title: "IoT Sensor Telemetry Dashboard",
    category: "Web Development",
    description: "Build a real-time web telemetry dashboard visualizing environmental soil sensor data with live charts, alert thresholds, and historic data filtering.",
    skills: ["React", "TypeScript", "WebSockets", "Tailwind CSS"],
    budgetMin: 16000,
    budgetMax: 26000,
    duration: "2-3 weeks",
    status: "OPEN",
    createdAt: "2026-10-11T14:30:00Z",
    clientId: 105,
    clientName: "AgriSense Tech",
    deliverables: [
      "WebSocket client with automated reconnection",
      "Real-time sensor charts with zoom and panning",
      "Configurable sound and visual alert thresholds",
      "CSV history log export"
    ],
    proposalsCount: 1,
  },
];

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 1,
    projectId: 1,
    projectTitle: "AI Customer Support Assistant",
    freelancerId: 201,
    freelancerName: "Ananya Roy",
    freelancerEmail: "ananya.dev@gmail.com",
    freelancerTitle: "Full-Stack & AI Developer",
    freelancerRating: 4.9,
    freelancerSkills: ["Python", "FastAPI", "LangChain", "React"],
    amount: 22000,
    deliveryDays: 14,
    coverLetter: "Hi Aakash, I have built multiple production LLM agents using LangChain and FastAPI. For your knowledge base, I will implement semantic chunking with hybrid search to ensure accurate answers with minimal latency. I've already prototyped a similar chatbot with streaming tokens for an EdTech platform.",
    status: "PENDING",
    createdAt: "2026-10-09T11:40:00Z",
  },
  {
    id: 2,
    projectId: 1,
    projectTitle: "AI Customer Support Assistant",
    freelancerId: 202,
    freelancerName: "Vikram Malhotra",
    freelancerEmail: "vikram.m@dev.io",
    freelancerTitle: "AI Engineer & MLOps",
    freelancerRating: 4.8,
    freelancerSkills: ["Python", "OpenAI", "FastAPI", "Docker"],
    amount: 25000,
    deliveryDays: 16,
    coverLetter: "Hello! I specialize in building conversational AI agents and integrating them into web applications. I can deliver a clean FastAPI service with Chroma vector DB and automated evaluation suites to test response accuracy.",
    status: "PENDING",
    createdAt: "2026-10-10T15:20:00Z",
  },
  {
    id: 3,
    projectId: 2,
    projectTitle: "E-commerce Website Development",
    freelancerId: 203,
    freelancerName: "Kavya Patel",
    freelancerEmail: "kavya.designs@gmail.com",
    freelancerTitle: "Frontend & Full Stack Dev",
    freelancerRating: 5.0,
    freelancerSkills: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
    amount: 32000,
    deliveryDays: 21,
    coverLetter: "I've developed 4 e-commerce platforms with Razorpay and Stripe integrations. I focus heavily on snappy mobile performance, smooth micro-interactions, and conversion-optimized checkout layouts. Excited to work on this!",
    status: "ACCEPTED",
    createdAt: "2026-10-07T18:00:00Z",
  },
  {
    id: 4,
    projectId: 3,
    projectTitle: "Smart Expense Tracker",
    freelancerId: 201,
    freelancerName: "Ananya Roy",
    freelancerEmail: "ananya.dev@gmail.com",
    freelancerTitle: "Full-Stack & AI Developer",
    freelancerRating: 4.9,
    freelancerSkills: ["React Native", "TypeScript", "Firebase"],
    amount: 18000,
    deliveryDays: 12,
    coverLetter: "I have experience with React Native and cross-platform mobile architectures. I can build an intuitive, gesture-driven expense logging interface with instant offline caching and clean monthly summary charts.",
    status: "PENDING",
    createdAt: "2026-10-08T13:10:00Z",
  },
  {
    id: 5,
    projectId: 7,
    projectTitle: "SaaS Landing Page & Brand Design",
    freelancerId: 201,
    freelancerName: "Ananya Roy",
    freelancerEmail: "ananya.dev@gmail.com",
    freelancerTitle: "Full-Stack & AI Developer",
    freelancerRating: 4.9,
    freelancerSkills: ["React", "Tailwind CSS", "UI/UX"],
    amount: 15000,
    deliveryDays: 10,
    coverLetter: "Delivered modern SaaS website design and code with 98+ Lighthouse score and high conversion structure.",
    status: "ACCEPTED",
    createdAt: "2026-10-02T10:00:00Z",
  },
];

export const TALENT_PROFILES: TalentProfile[] = [
  {
    id: 1,
    name: "Arjun Kumar",
    avatarText: "AK",
    title: "Full-Stack Developer",
    bio: "Pre-final year student at NIT. Specializes in responsive React SPAs, Node.js microservices, and PostgreSQL schemas.",
    rating: 4.9,
    completedJobs: 18,
    hourlyRate: 850,
    matchScore: 96,
    skills: ["React", "Node.js", "PostgreSQL", "TypeScript", "Docker"],
    location: "Bengaluru, India",
    verified: true,
  },
  {
    id: 2,
    name: "Priya Sharma",
    avatarText: "PS",
    title: "AI & Machine Learning Engineer",
    bio: "Passionate about generative AI, LangChain pipelines, RAG systems, and deploying models to FastAPI cloud endpoints.",
    rating: 4.9,
    completedJobs: 12,
    hourlyRate: 1100,
    matchScore: 94,
    skills: ["Python", "FastAPI", "LangChain", "PyTorch", "OpenAI"],
    location: "Hyderabad, India",
    verified: true,
  },
  {
    id: 3,
    name: "Rohan Verma",
    avatarText: "RV",
    title: "Mobile App Developer",
    bio: "Specializing in React Native, Flutter, and cross-platform consumer apps with seamless offline capabilities.",
    rating: 4.8,
    completedJobs: 15,
    hourlyRate: 900,
    matchScore: 89,
    skills: ["React Native", "TypeScript", "Firebase", "Redux", "Flutter"],
    location: "Pune, India",
    verified: true,
  },
  {
    id: 4,
    name: "Kavya Patel",
    avatarText: "KP",
    title: "UI/UX & Frontend Specialist",
    bio: "Obsessed with clean typographic hierarchy, design systems, and building pixel-perfect Tailwind web interfaces.",
    rating: 5.0,
    completedJobs: 22,
    hourlyRate: 950,
    matchScore: 93,
    skills: ["Figma", "React", "Tailwind CSS", "Next.js", "Design Systems"],
    location: "Ahmedabad, India",
    verified: true,
  },
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    timestamp: "10 mins ago",
    title: "New proposal submitted",
    description: "Ananya Roy submitted a proposal for 'AI Customer Support Assistant' (₹22,000).",
    type: "proposal",
  },
  {
    id: "act-2",
    timestamp: "2 hours ago",
    title: "Project accepted",
    description: "TechCraft Labs accepted Kavya Patel's proposal for 'E-commerce Website Development'.",
    type: "completion",
  },
  {
    id: "act-3",
    timestamp: "Yesterday",
    title: "New project posted",
    description: "TechCraft Labs published 'Machine Learning API Deployment' with ₹20,000 - ₹32,000 budget.",
    type: "project",
  },
  {
    id: "act-4",
    timestamp: "2 days ago",
    title: "High-match talent discovered",
    description: "UpLift AI matched Arjun Kumar (96% Match) with recent Web Development project.",
    type: "match",
  },
];
