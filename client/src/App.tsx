import { useEffect, useMemo, useState } from "react";
import type { AnalyticsSnapshot, Priority, Task } from "@shared/types";
import { createTask, deleteTask, fetchAnalytics, fetchTasks, toggleTaskCompletion } from "./api";

const priorityLabels: Record<Priority, string> = {
  high: "Haute",
  medium: "Moyenne",
  low: "Basse",
};

const priorityColors: Record<Priority, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#3b82f6",
};

function TaskForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: { title: string; description: string; dueDate?: string | null; priority: Priority }) => void;
  loading: boolean;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim(), dueDate, priority });
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate(null);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="field">
        <label>Titre *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ajouter une tâche"
          required
        />
      </div>

      <div className="field">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Détails, sous-tâches, etc."
          rows={2}
        />
      </div>

      <div className="grid">
        <div className="field">
          <label>Échéance</label>
          <input type="date" value={dueDate ?? ""} onChange={(e) => setDueDate(e.target.value || null)} />
        </div>

        <div className="field">
          <label>Priorité</label>
          <div className="pill-group">
            {(
              [
                ["high", "Haute"],
                ["medium", "Moyenne"],
                ["low", "Basse"],
              ] as [Priority, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setPriority(value)}
                className={`pill ${priority === value ? "pill-active" : ""}`}
                style={{ borderColor: priorityColors[value] }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className="primary" type="submit" disabled={loading}>
        {loading ? "Enregistrement..." : "Ajouter la tâche"}
      </button>
    </form>
  );
}

function StatsBar({ stats }: { stats: AnalyticsSnapshot | null }) {
  if (!stats) return null;

  return (
    <div className="stats">
      <div>
        <p className="muted">Tâches totales</p>
        <strong>{stats.total}</strong>
      </div>
      <div>
        <p className="muted">Complétées</p>
        <strong>{stats.completed}</strong>
      </div>
      <div>
        <p className="muted">Urgentes actives</p>
        <strong>{stats.urgentActive}</strong>
      </div>
      <div>
        <p className="muted">Score</p>
        <strong>{stats.productivityScore}%</strong>
      </div>
    </div>
  );
}

function TaskList({ tasks, onToggle, onDelete }: { tasks: Task[]; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  if (tasks.length === 0) {
    return <p className="muted">Commencez par créer votre première tâche ✨</p>;
  }

  return (
    <div className="tasks">
      {tasks.map((task) => (
        <article key={task.id} className={`task ${task.completed ? "task-done" : ""}`}>
          <div className="task-header">
            <span className="badge" style={{ backgroundColor: priorityColors[task.priority] }}>
              {priorityLabels[task.priority]}
            </span>
            <div className="actions">
              <button onClick={() => onToggle(task.id)} className="ghost">
                {task.completed ? "Réactiver" : "Terminer"}
              </button>
              <button onClick={() => onDelete(task.id)} className="ghost destructive">
                Supprimer
              </button>
            </div>
          </div>
          <h3>{task.title}</h3>
          {task.description ? <p className="muted">{task.description}</p> : null}
          <div className="task-footer">
            <p className="muted">
              Créée le {new Date(task.createdAt).toLocaleDateString("fr-FR")}
              {task.dueDate ? ` · Échéance ${new Date(task.dueDate).toLocaleDateString("fr-FR")}` : ""}
            </p>
            {task.completed && task.completedAt ? (
              <span className="success">Complétée le {new Date(task.completedAt).toLocaleDateString("fr-FR")}</span>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<AnalyticsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeTasks = useMemo(() => tasks.filter((task) => !task.completed), [tasks]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [loadedTasks, snapshot] = await Promise.all([fetchTasks(), fetchAnalytics()]);
        setTasks(loadedTasks);
        setStats(snapshot);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const refreshStats = async () => {
    try {
      const snapshot = await fetchAnalytics();
      setStats(snapshot);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (payload: { title: string; description: string; dueDate?: string | null; priority: Priority }) => {
    setSaving(true);
    setError(null);
    try {
      const task = await createTask(payload);
      setTasks((current) => [task, ...current]);
      await refreshStats();
    } catch (err) {
      console.error(err);
      setError("La création de la tâche a échoué");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const updated = await toggleTaskCompletion(id);
      setTasks((current) => current.map((task) => (task.id === id ? updated : task)));
      await refreshStats();
    } catch (err) {
      console.error(err);
      setError("Mise à jour impossible");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task.id !== id));
      await refreshStats();
    } catch (err) {
      console.error(err);
      setError("Suppression impossible");
    }
  };

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="muted">Productivité</p>
          <h1>Maiden Task Manager</h1>
          <p className="lead">Ajoutez vos tâches, suivez vos progrès et améliorez votre score au quotidien.</p>
        </div>
        <div className="badge-large">{stats?.productivityScore ?? 0}%</div>
      </header>

      {error ? <div className="alert">{error}</div> : null}
      {loading ? <p className="muted">Chargement des données...</p> : null}

      <section className="panel">
        <h2>Créer une tâche</h2>
        <TaskForm onSubmit={handleCreate} loading={saving} />
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Tâches actives</h2>
          <span className="muted">{activeTasks.length} en cours</span>
        </div>
        <TaskList tasks={activeTasks} onToggle={handleToggle} onDelete={handleDelete} />
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Tâches terminées</h2>
          <span className="muted">{tasks.length - activeTasks.length}</span>
        </div>
        <TaskList tasks={tasks.filter((task) => task.completed)} onToggle={handleToggle} onDelete={handleDelete} />
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Statistiques</h2>
        </div>
        <StatsBar stats={stats} />
      </section>
    </main>
  );
}
