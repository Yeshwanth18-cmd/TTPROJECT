export type ProposalStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface Proposal {
  id: number;
  projectId: number;
  projectTitle: string;
  freelancerId: number;
  freelancerName: string;
  freelancerEmail: string;
  freelancerTitle?: string;
  freelancerRating?: number;
  freelancerSkills?: string[];
  amount: number;
  deliveryDays: number;
  coverLetter: string;
  status: ProposalStatus;
  createdAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  openProjects: number;
  inProgressProjects: number;
  completedProjects: number;
  totalProposals: number;
  pendingProposals: number;
  acceptedProposals: number;
  totalUsers: number;
  totalSpent?: number;
  activeTalent?: number;
}
