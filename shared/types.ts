export type Priority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string | null;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  completedAt?: string | null;
}

export interface AnalyticsSnapshot {
  total: number;
  completed: number;
  urgentActive: number;
  productivityScore: number;
}
