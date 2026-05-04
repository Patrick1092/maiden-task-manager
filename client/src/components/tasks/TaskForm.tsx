import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Task {
  id: number;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: "high" | "medium" | "low";
}

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
}

export function TaskForm({ open, onOpenChange, task }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");

  // Charger les valeurs de la tâche quand le dialogue s'ouvre en mode édition
  useEffect(() => {
    if (open && task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
      setPriority(task.priority || "medium");
    } else if (open && !task) {
      // Réinitialiser pour une nouvelle tâche
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
    }
  }, [open, task]);

  const utils = trpc.useUtils();

  const createMutation = trpc.tasks.create.useMutation({
    onSuccess: () => {
      toast.success("Tâche créée avec succès");
      utils.tasks.list.invalidate();
      utils.analytics.dashboard.invalidate();
      onOpenChange(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erreur lors de la création de la tâche");
    },
  });

  const updateMutation = trpc.tasks.update.useMutation({
    onSuccess: () => {
      toast.success("Tâche mise à jour avec succès");
      utils.tasks.list.invalidate();
      utils.analytics.dashboard.invalidate();
      onOpenChange(false);
      resetForm();
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de la tâche");
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Le titre est requis");
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority,
    };

    if (task) {
      updateMutation.mutate({
        id: task.id,
        ...taskData,
      });
    } else {
      createMutation.mutate(taskData);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{task ? "Modifier la tâche" : "Nouvelle tâche"}</DialogTitle>
          <DialogDescription>
            {task
              ? "Modifiez les détails de votre tâche ci-dessous."
              : "Créez une nouvelle tâche pour rester organisé."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Terminer le rapport"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ajoutez des détails sur cette tâche..."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Sélectionner une priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Haute (Urgent)</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {task ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
