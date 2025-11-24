import type { AnalyticsSnapshot, Task } from "@shared/types";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE}/tasks`);
  if (!response.ok) throw new Error("Impossible de récupérer les tâches");
  return response.json();
}

export async function createTask(payload: Partial<Task>): Promise<Task> {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Impossible de créer la tâche");
  return response.json();
}

export async function toggleTaskCompletion(id: string): Promise<Task> {
  const response = await fetch(`${API_BASE}/tasks/${id}/complete`, {
    method: "PATCH",
  });
  if (!response.ok) throw new Error("Impossible de mettre à jour la tâche");
  return response.json();
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Impossible de supprimer la tâche");
}

export async function fetchAnalytics(): Promise<AnalyticsSnapshot> {
  const response = await fetch(`${API_BASE}/analytics`);
  if (!response.ok) throw new Error("Impossible de charger les statistiques");
  return response.json();
}
