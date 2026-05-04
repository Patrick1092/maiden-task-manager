import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Plus, ArrowUpDown, Filter, X } from "lucide-react";
import { useState } from "react";
import { TaskCard } from "./TaskCard";
import { TaskForm } from "./TaskForm";
import { TagManager } from "../tags/TagManager";

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

export function TaskList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "overdue">("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "dueDate" | "priority">("createdAt");
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [showTagManager, setShowTagManager] = useState(false);

  const { data: tags = [] } = trpc.tags.list.useQuery();

  const { data: tasks = [], isLoading } = trpc.tasks.list.useQuery();

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingTask(null);
    }
  };

  const now = new Date();
  now.setHours(0, 0, 0, 0); // Début de la journée

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "active") return task.completed === 0;
      if (filter === "completed") return task.completed === 1;
      if (filter === "overdue") {
        // Tâches non complétées avec date d'échéance dépassée
        return (
          task.completed === 0 &&
          task.dueDate &&
          new Date(task.dueDate) < now
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "createdAt") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "dueDate") {
        // Tâches sans date d'échéance à la fin
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

  const activeTasks = tasks.filter((t) => t.completed === 0);
  const completedTasks = tasks.filter((t) => t.completed === 1);
  const overdueTasks = tasks.filter(
    (t) => t.completed === 0 && t.dueDate && new Date(t.dueDate) < now
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Chargement des tâches...</div>
      </div>
    );
  }

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      red: "bg-red-500",
      orange: "bg-orange-500",
      yellow: "bg-yellow-500",
      green: "bg-green-500",
      blue: "bg-blue-500",
      indigo: "bg-indigo-500",
      purple: "bg-purple-500",
      pink: "bg-pink-500",
    };
    return colorMap[color] || "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      {showTagManager && (
        <div className="mb-6">
          <TagManager />
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mes Tâches</h2>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTagManager(!showTagManager)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showTagManager ? "Masquer tags" : "Gérer tags"}
          </Button>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trier par..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date de création</SelectItem>
                <SelectItem value="dueDate">Date d'échéance</SelectItem>
                <SelectItem value="priority">Priorité</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle tâche
          </Button>
        </div>
      </div>

      {/* Filtre par tags */}
      {tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filtrer par tag:</span>
          <Button
            variant={selectedTagId === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTagId(null)}
          >
            Tous
          </Button>
          {tags.map((tag) => (
            <Button
              key={tag.id}
              variant={selectedTagId === tag.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTagId(tag.id)}
              className="flex items-center gap-2"
            >
              <div className={`w-3 h-3 rounded-full ${getColorClass(tag.color)}`} />
              {tag.name}
              {selectedTagId === tag.id && (
                <X className="h-3 w-3" onClick={(e) => { e.stopPropagation(); setSelectedTagId(null); }} />
              )}
            </Button>
          ))}
        </div>
      )}

      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            Toutes ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Actives ({activeTasks.length})
          </TabsTrigger>
          <TabsTrigger value="overdue" className="text-red-600 data-[state=active]:text-red-600">
            En retard ({overdueTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Terminées ({completedTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {filter === "all"
                  ? "Aucune tâche pour le moment"
                  : filter === "active"
                  ? "Aucune tâche active"
                  : filter === "overdue"
                  ? "Aucune tâche en retard - Excellent travail !"
                  : "Aucune tâche terminée"}
              </p>
              {filter === "all" && (
                <Button onClick={() => setIsFormOpen(true)} variant="outline">
                  Créer votre première tâche
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEdit} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <TaskForm open={isFormOpen} onOpenChange={handleFormClose} task={editingTask} />
    </div>
  );
}
