import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Check, Pencil, Trash2 } from "lucide-react";
import { PriorityBadge } from "./PriorityBadge";
import { toast } from "sonner";

interface Task {
  id: number;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: "high" | "medium" | "low";
  completed: number;
  completedAt: Date | null;
  createdAt: Date;
}

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const utils = trpc.useUtils();

  const toggleMutation = trpc.tasks.toggle.useMutation({
    onMutate: async ({ id }) => {
      await utils.tasks.list.cancel();
      const previousTasks = utils.tasks.list.getData();

      utils.tasks.list.setData(undefined, (old) => {
        if (!old) return old;
        return old.map((t) =>
          t.id === id
            ? {
                ...t,
                completed: t.completed === 1 ? 0 : 1,
                completedAt: t.completed === 1 ? null : new Date(),
              }
            : t
        );
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        utils.tasks.list.setData(undefined, context.previousTasks);
      }
      toast.error("Erreur lors de la mise à jour de la tâche");
    },
    onSuccess: () => {
      utils.analytics.dashboard.invalidate();
    },
  });

  const deleteMutation = trpc.tasks.delete.useMutation({
    onMutate: async ({ id }) => {
      await utils.tasks.list.cancel();
      const previousTasks = utils.tasks.list.getData();

      utils.tasks.list.setData(undefined, (old) => {
        if (!old) return old;
        return old.filter((t) => t.id !== id);
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        utils.tasks.list.setData(undefined, context.previousTasks);
      }
      toast.error("Erreur lors de la suppression de la tâche");
    },
    onSuccess: () => {
      toast.success("Tâche supprimée avec succès");
      utils.analytics.dashboard.invalidate();
    },
  });

  const isCompleted = task.completed === 1;
  const isHighPriority = task.priority === "high" && !isCompleted;

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card
      className={`transition-all hover:shadow-md ${
        isHighPriority ? "high-priority-alert border-red-500" : ""
      } ${isCompleted ? "bg-muted" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className={`text-lg ${isCompleted ? "task-completed" : ""}`}>
              {task.title}
            </CardTitle>
            {task.dueDate && (
              <CardDescription className="mt-1">
                Échéance: {formatDate(task.dueDate)}
              </CardDescription>
            )}
          </div>
          <PriorityBadge priority={task.priority} />
        </div>
      </CardHeader>
      <CardContent>
        {task.description && (
          <p className={`text-sm text-muted-foreground mb-4 ${isCompleted ? "task-completed" : ""}`}>
            {task.description}
          </p>
        )}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={isCompleted ? "secondary" : "default"}
            onClick={() => toggleMutation.mutate({ id: task.id })}
            disabled={toggleMutation.isPending}
            className="flex items-center gap-1"
          >
            <Check className="h-4 w-4" />
            {isCompleted ? "Marquer comme non fait" : "Marquer comme fait"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit?.(task)}
            disabled={deleteMutation.isPending}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
                deleteMutation.mutate({ id: task.id });
              }
            }}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
