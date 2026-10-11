export type ProjectStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  status: ProjectStatus;
  createdAt: string;
  clientId: number;
  clientName?: string;
  skills?: string[];
  duration?: string;
  deliverables?: string[];
  proposalsCount?: number;
}
