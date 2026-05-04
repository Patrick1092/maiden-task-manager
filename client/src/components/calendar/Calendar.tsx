import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: "high" | "medium" | "low";
  completed: number;
}

interface CalendarProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onTaskDrop?: (taskId: number, newDate: Date) => void;
}

export function Calendar({ tasks, onTaskClick, onTaskDrop }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Obtenir le premier et dernier jour du mois
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  // Obtenir le jour de la semaine du premier jour (0 = dimanche, 1 = lundi, etc.)
  const firstDayWeekday = firstDayOfMonth.getDay();
  
  // Nombre de jours dans le mois
  const daysInMonth = lastDayOfMonth.getDate();

  // Créer un tableau de jours pour le calendrier
  const calendarDays: (number | null)[] = [];
  
  // Ajouter des jours vides au début (pour aligner avec le premier jour de la semaine)
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }
  
  // Ajouter tous les jours du mois
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Grouper les tâches par date
  const tasksByDate = tasks.reduce((acc, task) => {
    if (!task.dueDate) return acc;
    
    const taskDate = new Date(task.dueDate);
    if (taskDate.getMonth() === month && taskDate.getFullYear() === year) {
      const day = taskDate.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(task);
    }
    
    return acc;
  }, {} as Record<number, Task[]>);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const today = new Date();
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      {/* En-tête du calendrier */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {monthNames[month]} {year}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Aujourd'hui
          </Button>
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grille du calendrier */}
      <Card className="p-4">
        <div className="grid grid-cols-7 gap-2">
          {/* En-têtes des jours de la semaine */}
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-sm text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}

          {/* Jours du mois */}
          {calendarDays.map((day, index) => {
            const dayTasks = day ? tasksByDate[day] || [] : [];
            const isCurrentDay = day ? isToday(day) : false;

            return (
              <div
                key={index}
                onDragOver={(e) => {
                  if (day) {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }
                }}
                onDrop={(e) => {
                  if (day) {
                    e.preventDefault();
                    const taskId = e.dataTransfer.getData("taskId");
                    if (taskId) {
                      const newDate = new Date(year, month, day);
                      onTaskDrop?.(Number(taskId), newDate);
                    }
                  }
                }}
                className={`min-h-[100px] border rounded-lg p-2 ${
                  day ? "bg-card hover:bg-accent/50 transition-colors" : "bg-muted/30"
                } ${isCurrentDay ? "ring-2 ring-primary" : ""}`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${isCurrentDay ? "text-primary font-bold" : ""}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map((task) => (
                        <button
                          key={task.id}
                          draggable={!task.completed}
                          onDragStart={(e) => {
                            e.dataTransfer.setData("taskId", task.id.toString());
                            e.dataTransfer.effectAllowed = "move";
                          }}
                          onClick={() => onTaskClick?.(task)}
                          className={`w-full text-left text-xs p-1 rounded truncate cursor-move ${
                            task.completed
                              ? "bg-muted text-muted-foreground line-through cursor-not-allowed"
                              : "bg-background hover:bg-accent"
                          } border-l-2 ${getPriorityColor(task.priority)}`}
                          title={task.title}
                        >
                          {task.title}
                        </button>
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{dayTasks.length - 3} autre(s)
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Légende */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Haute priorité</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>Moyenne priorité</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Basse priorité</span>
        </div>
      </div>
    </div>
  );
}
