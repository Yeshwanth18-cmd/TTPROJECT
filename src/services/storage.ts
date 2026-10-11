import type { Project, ProjectStatus } from "../types/project";
import type { Proposal, ProposalStatus, DashboardStats } from "../types/proposal";
import type { UserRole } from "../types/auth";
import {
  INITIAL_PROJECTS,
  INITIAL_PROPOSALS,
  INITIAL_ACTIVITIES,
  TALENT_PROFILES,
  type TalentProfile,
  type ActivityItem,
} from "./mockData";

const PROJECTS_KEY = "uplift_projects";
const PROPOSALS_KEY = "uplift_proposals";
const ACTIVITIES_KEY = "uplift_activities";

export function getStoredProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(raw) as Project[];
  } catch {
    return INITIAL_PROJECTS;
  }
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function getStoredProject(id: number): Project | undefined {
  const projects = getStoredProjects();
  return projects.find((p) => p.id === id);
}

export function createStoredProject(data: {
  title: string;
  description: string;
  category: string;
  skills: string[];
  budgetMin: number;
  budgetMax: number;
  duration: string;
  clientId: number;
  clientName: string;
  deliverables?: string[];
}): Project {
  const projects = getStoredProjects();
  const maxId = projects.reduce((max, p) => (p.id > max ? p.id : max), 0);
  const newProject: Project = {
    id: maxId + 1,
    title: data.title,
    description: data.description,
    category: data.category,
    skills: data.skills.length > 0 ? data.skills : ["General"],
    budgetMin: data.budgetMin,
    budgetMax: data.budgetMax,
    duration: data.duration || "2-3 weeks",
    status: "OPEN",
    createdAt: new Date().toISOString(),
    clientId: data.clientId,
    clientName: data.clientName,
    deliverables: data.deliverables && data.deliverables.length > 0 ? data.deliverables : [
      "Well-tested and documented code repository",
      "Live deployment preview",
      "Handover guide and demonstration"
    ],
    proposalsCount: 0,
  };

  const updatedProjects = [newProject, ...projects];
  saveProjects(updatedProjects);

  addActivity({
    title: "New project posted",
    description: `${data.clientName} published '${data.title}' (₹${data.budgetMin.toLocaleString()} - ₹${data.budgetMax.toLocaleString()}).`,
    type: "project",
  });

  return newProject;
}

export function updateStoredProjectStatus(id: number, status: ProjectStatus): Project | null {
  const projects = getStoredProjects();
  let updatedProject: Project | null = null;
  const updated = projects.map((p) => {
    if (p.id === id) {
      updatedProject = { ...p, status };
      return updatedProject;
    }
    return p;
  });
  if (updatedProject) {
    saveProjects(updated);
    addActivity({
      title: "Project status updated",
      description: `Project '${(updatedProject as Project).title}' updated to ${status.replace("_", " ")}.`,
      type: "project",
    });
  }
  return updatedProject;
}

export function getStoredProposals(): Proposal[] {
  try {
    const raw = localStorage.getItem(PROPOSALS_KEY);
    if (!raw) {
      localStorage.setItem(PROPOSALS_KEY, JSON.stringify(INITIAL_PROPOSALS));
      return INITIAL_PROPOSALS;
    }
    return JSON.parse(raw) as Proposal[];
  } catch {
    return INITIAL_PROPOSALS;
  }
}

export function saveProposals(proposals: Proposal[]) {
  localStorage.setItem(PROPOSALS_KEY, JSON.stringify(proposals));
}

export function createStoredProposal(data: {
  projectId: number;
  projectTitle: string;
  freelancerId: number;
  freelancerName: string;
  freelancerEmail: string;
  freelancerTitle?: string;
  amount: number;
  deliveryDays: number;
  coverLetter: string;
}): Proposal {
  const proposals = getStoredProposals();
  const maxId = proposals.reduce((max, p) => (p.id > max ? p.id : max), 0);
  const newProposal: Proposal = {
    id: maxId + 1,
    projectId: data.projectId,
    projectTitle: data.projectTitle,
    freelancerId: data.freelancerId,
    freelancerName: data.freelancerName,
    freelancerEmail: data.freelancerEmail,
    freelancerTitle: data.freelancerTitle || "Emerging Tech Freelancer",
    freelancerRating: 4.9,
    amount: data.amount,
    deliveryDays: data.deliveryDays,
    coverLetter: data.coverLetter,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };

  const updatedProposals = [newProposal, ...proposals];
  saveProposals(updatedProposals);

  // Update proposalsCount on project
  const projects = getStoredProjects();
  const updatedProjects = projects.map((p) => {
    if (p.id === data.projectId) {
      return { ...p, proposalsCount: (p.proposalsCount || 0) + 1 };
    }
    return p;
  });
  saveProjects(updatedProjects);

  addActivity({
    title: "New proposal received",
    description: `${data.freelancerName} sent a proposal for '${data.projectTitle}' (₹${data.amount.toLocaleString()}).`,
    type: "proposal",
  });

  return newProposal;
}

export function updateStoredProposalStatus(
  proposalId: number,
  status: ProposalStatus
): Proposal | null {
  const proposals = getStoredProposals();
  const target = proposals.find((p) => p.id === proposalId);
  if (!target) return null;

  const updatedTarget: Proposal = { ...target, status };

  const updatedProposals = proposals.map((p) => {
    if (p.id === proposalId) return updatedTarget;
    // If accepted, mark competing proposals on the same project as rejected
    if (status === "ACCEPTED" && p.projectId === target.projectId && p.status === "PENDING") {
      return { ...p, status: "REJECTED" as ProposalStatus };
    }
    return p;
  });
  saveProposals(updatedProposals);

  // If accepted, update project to IN_PROGRESS
  if (status === "ACCEPTED") {
    updateStoredProjectStatus(target.projectId, "IN_PROGRESS");
    addActivity({
      title: "Proposal accepted",
      description: `${target.freelancerName}'s proposal for '${target.projectTitle}' was accepted! Project is now in progress.`,
      type: "completion",
    });
  }

  return updatedTarget;
}

export function getStoredActivities(): ActivityItem[] {
  try {
    const raw = localStorage.getItem(ACTIVITIES_KEY);
    if (!raw) {
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(INITIAL_ACTIVITIES));
      return INITIAL_ACTIVITIES;
    }
    return JSON.parse(raw) as ActivityItem[];
  } catch {
    return INITIAL_ACTIVITIES;
  }
}

export function addActivity(item: Omit<ActivityItem, "id" | "timestamp">) {
  const activities = getStoredActivities();
  const newActivity: ActivityItem = {
    id: `act-${Date.now()}`,
    timestamp: "Just now",
    ...item,
  };
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify([newActivity, ...activities.slice(0, 15)]));
}

export function getTalentProfiles(): TalentProfile[] {
  return TALENT_PROFILES;
}

export function getDashboardStats(role?: UserRole, userId?: number): DashboardStats {
  const projects = getStoredProjects();
  const proposals = getStoredProposals();

  const totalProjects = projects.length;
  const openProjects = projects.filter((p) => p.status === "OPEN").length;
  const inProgressProjects = projects.filter((p) => p.status === "IN_PROGRESS").length;
  const completedProjects = projects.filter((p) => p.status === "COMPLETED").length;

  if (role === "CLIENT") {
    const myProjects = userId ? projects.filter((p) => p.clientId === userId) : projects;
    const myProjectIds = new Set(myProjects.map((p) => p.id));
    const incomingProposals = proposals.filter((p) => myProjectIds.has(p.projectId));

    const totalSpent = myProjects
      .filter((p) => p.status === "IN_PROGRESS" || p.status === "COMPLETED")
      .reduce((sum, p) => sum + (p.budgetMin || 0), 0);

    return {
      totalProjects: myProjects.length,
      openProjects: myProjects.filter((p) => p.status === "OPEN").length,
      inProgressProjects: myProjects.filter((p) => p.status === "IN_PROGRESS").length,
      completedProjects: myProjects.filter((p) => p.status === "COMPLETED").length,
      totalProposals: incomingProposals.length,
      pendingProposals: incomingProposals.filter((p) => p.status === "PENDING").length,
      acceptedProposals: incomingProposals.filter((p) => p.status === "ACCEPTED").length,
      totalUsers: 142,
      totalSpent: totalSpent > 0 ? totalSpent : 24500,
      activeTalent: 6,
    };
  }

  if (role === "FREELANCER") {
    const myProposals = userId ? proposals.filter((p) => p.freelancerId === userId) : proposals;
    return {
      totalProjects: openProjects,
      openProjects,
      inProgressProjects: myProposals.filter((p) => p.status === "ACCEPTED").length,
      completedProjects: 14,
      totalProposals: myProposals.length,
      pendingProposals: myProposals.filter((p) => p.status === "PENDING").length,
      acceptedProposals: myProposals.filter((p) => p.status === "ACCEPTED").length,
      totalUsers: 142,
      totalSpent: 37000,
      activeTalent: 4,
    };
  }

  return {
    totalProjects,
    openProjects,
    inProgressProjects,
    completedProjects,
    totalProposals: proposals.length,
    pendingProposals: proposals.filter((p) => p.status === "PENDING").length,
    acceptedProposals: proposals.filter((p) => p.status === "ACCEPTED").length,
    totalUsers: 142,
  };
}
