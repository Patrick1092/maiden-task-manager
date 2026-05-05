import { notifyOwner } from "./_core/notification";
import { getDb } from "./db";
import { tasks } from "../drizzle/schema";
import { and, eq, gte, lte, sql } from "drizzle-orm";

/**
 * Vérifie les tâches qui arrivent à échéance dans les prochaines 24h
 * et envoie une notification pour les tâches haute priorité
 */
export async function checkUpcomingTasks(): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[TaskReminder] Database not available");
    return;
  }

  try {
    // Calculer la plage de temps : maintenant + 24h
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Récupérer les tâches haute priorité non complétées qui arrivent à échéance dans 24h
    const upcomingTasks = await db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.completed, 0),
          eq(tasks.priority, "high"),
          sql`${tasks.dueDate} >= NOW()`,
          sql`${tasks.dueDate} <= ${in24Hours.toISOString()}`
        )
      );

    if (upcomingTasks.length === 0) {
      console.log("[TaskReminder] No upcoming high-priority tasks");
      return;
    }

    // Grouper les tâches par utilisateur
    const tasksByUser = upcomingTasks.reduce((acc, task) => {
      if (!acc[task.userId]) {
        acc[task.userId] = [];
      }
      acc[task.userId].push(task);
      return {};
    }, {} as Record<number, typeof upcomingTasks>);

    // Envoyer une notification pour chaque utilisateur
    for (const [userId, userTasks] of Object.entries(tasksByUser)) {
      const taskList = userTasks
        .map((t) => `- ${t.title} (échéance: ${t.dueDate ? new Date(t.dueDate).toLocaleDateString("fr-FR") : "Non définie"})`)
        .join("\n");

      const title = `⚠️ ${userTasks.length} tâche(s) haute priorité arrive(nt) à échéance dans 24h`;
      const content = `Bonjour,\n\nVous avez ${userTasks.length} tâche(s) haute priorité qui arrive(nt) à échéance dans les prochaines 24 heures :\n\n${taskList}\n\nConnectez-vous à Maiden Task Manager pour les gérer.`;

      const success = await notifyOwner({ title, content });
      
      if (success) {
        console.log(`[TaskReminder] Notification sent for user ${userId} (${userTasks.length} tasks)`);
      } else {
        console.warn(`[TaskReminder] Failed to send notification for user ${userId}`);
      }
    }
  } catch (error) {
    console.error("[TaskReminder] Error checking upcoming tasks:", error);
  }
}

/**
 * Démarre le service de vérification périodique (toutes les heures)
 * Note: Dans un environnement de production, utilisez un cron job externe
 * ou un service de planification comme node-cron
 */
export function startTaskReminderService(): void {
  console.log("[TaskReminder] Service started - checking every hour");
  
  // Vérification immédiate au démarrage
  checkUpcomingTasks();
  
  // Puis toutes les heures
  setInterval(() => {
    checkUpcomingTasks();
  }, 60 * 60 * 1000); // 1 heure
}
