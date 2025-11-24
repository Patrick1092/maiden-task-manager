import express from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { nanoid } from "nanoid";
import type { AnalyticsSnapshot, Priority, Task } from "../../shared/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT ?? 3000);
const initialTasks: Task[] = [
  {
    id: nanoid(),
    title: "Bienvenue dans Maiden Task Manager",
    description:
      "Commencez par ajouter vos tâches et cochez-les au fur et à mesure pour voir votre score évoluer.",
    priority: "high",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];
let tasks: Task[] = [...initialTasks];

const validatePriority = (priority: string): priority is Priority =>
  priority === "high" || priority === "medium" || priority === "low";

const computeAnalytics = (): AnalyticsSnapshot => {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const urgentActive = tasks.filter((task) => task.priority === "high" && !task.completed).length;
  const productivityScore = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, urgentActive, productivityScore };
};

app.get("/api/tasks", (_req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const { title, description, dueDate, priority } = req.body as Partial<Task>;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Le titre est obligatoire." });
  }

  if (priority && !validatePriority(priority)) {
    return res.status(400).json({ error: "Priorité invalide." });
  }

  const newTask: Task = {
    id: nanoid(),
    title: title.trim(),
    description: description?.trim() || undefined,
    dueDate: dueDate ?? null,
    priority: priority ?? "medium",
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };

  tasks.unshift(newTask);
  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, priority, completed } = req.body as Partial<Task>;
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({ error: "Tâche introuvable." });
  }

  if (title && typeof title === "string") {
    task.title = title.trim();
  }

  if (typeof description === "string") {
    task.description = description.trim();
  }

  if (typeof dueDate === "string" || dueDate === null) {
    task.dueDate = dueDate;
  }

  if (priority) {
    if (!validatePriority(priority)) {
      return res.status(400).json({ error: "Priorité invalide." });
    }
    task.priority = priority;
  }

  if (typeof completed === "boolean") {
    task.completed = completed;
    task.completedAt = completed ? new Date().toISOString() : null;
  }

  res.json(task);
});

app.patch("/api/tasks/:id/complete", (req, res) => {
  const { id } = req.params;
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({ error: "Tâche introuvable." });
  }

  task.completed = !task.completed;
  task.completedAt = task.completed ? new Date().toISOString() : null;

  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const beforeCount = tasks.length;
  tasks = tasks.filter((task) => task.id !== id);

  if (tasks.length === beforeCount) {
    return res.status(404).json({ error: "Tâche introuvable." });
  }

  res.status(204).send();
});

app.get("/api/analytics", (_req, res) => {
  res.json(computeAnalytics());
});

const publicDir = path.resolve(__dirname, "../../dist/public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Maiden Task Manager en écoute sur le port ${PORT}`);
});
