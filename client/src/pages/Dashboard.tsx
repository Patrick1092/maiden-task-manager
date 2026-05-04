import { useAuth } from "@/_core/hooks/useAuth";
import { ProductivityScore } from "@/components/dashboard/ProductivityScore";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TaskList } from "@/components/tasks/TaskList";
import { Calendar } from "@/components/calendar/Calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { AlertCircle, CheckCircle2, ListTodo, Target, CalendarDays } from "lucide-react";
import { APP_LOGO, getLoginUrl } from "@/const";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

function CalendarView() {
  const { data: tasks = [] } = trpc.tasks.list.useQuery();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const utils = trpc.useUtils();

  const updateTaskMutation = trpc.tasks.update.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
      utils.analytics.dashboard.invalidate();
    },
  });

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    console.log("Tâche sélectionnée:", task);
  };

  const handleTaskDrop = (taskId: number, newDate: Date) => {
    updateTaskMutation.mutate({
      id: taskId,
      dueDate: newDate,
    });
  };

  return <Calendar tasks={tasks} onTaskClick={handleTaskClick} onTaskDrop={handleTaskDrop} />;
}

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  const { data: analytics, isLoading: analyticsLoading } = trpc.analytics.dashboard.useQuery(
    undefined,
    {
      enabled: isAuthenticated,
    }
  );

  const utils = trpc.useUtils();
  
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      // Invalider tous les caches
      utils.invalidate();
      // Rediriger vers la page de connexion
      setTimeout(() => {
        window.location.href = getLoginUrl();
      }, 100);
    },
    onError: (error) => {
      console.error("Erreur de déconnexion:", error);
      // Forcer la redirection même en cas d'erreur
      window.location.href = getLoginUrl();
    },
  });

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={APP_LOGO} 
                alt="Maiden Task Manager Logo" 
                className="h-16 w-16 object-contain transition-all duration-300 hover:scale-110 hover:drop-shadow-lg cursor-pointer animate-pulse-slow" 
              />
              <div>
                <h1 className="text-3xl font-bold">Maiden Task Manager</h1>
                <p className="text-muted-foreground">Bienvenue, {user?.name || user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              {logoutMutation.isPending ? "Déconnexion..." : "Déconnexion"}
            </button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tasks">Tâches</TabsTrigger>
            <TabsTrigger value="calendar">Calendrier</TabsTrigger>
            <TabsTrigger value="analytics">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            <TaskList />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <CalendarView />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Tableau de bord analytique</h2>

              {analyticsLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Chargement des statistiques...
                </div>
              ) : analytics ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                      title="Total des tâches"
                      value={analytics.allTasks.total}
                      description="Toutes vos tâches"
                      icon={ListTodo}
                    />
                    <StatsCard
                      title="Tâches complétées"
                      value={analytics.allTasks.completed}
                      description={`${analytics.allTasks.total - analytics.allTasks.completed} restantes`}
                      icon={CheckCircle2}
                      trend="up"
                    />
                    <StatsCard
                      title="Haute priorité"
                      value={analytics.allTasks.highPriority}
                      description="Tâches urgentes actives"
                      icon={AlertCircle}
                      trend={analytics.allTasks.highPriority > 0 ? "down" : "neutral"}
                      className="border-red-200"
                    />
                    <StatsCard
                      title="Score global"
                      value={`${
                        analytics.allTasks.total > 0
                          ? Math.round((analytics.allTasks.completed / analytics.allTasks.total) * 100)
                          : 0
                      }%`}
                      description="Taux de complétion"
                      icon={Target}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <ProductivityScore
                      score={analytics.daily.score}
                      total={analytics.daily.total}
                      completed={analytics.daily.completed}
                      period="daily"
                    />
                    <ProductivityScore
                      score={analytics.weekly.score}
                      total={analytics.weekly.total}
                      completed={analytics.weekly.completed}
                      period="weekly"
                    />
                    <ProductivityScore
                      score={analytics.monthly.score}
                      total={analytics.monthly.total}
                      completed={analytics.monthly.completed}
                      period="monthly"
                    />
                  </div>

                  {analytics.daily.score === 100 && analytics.daily.total > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                      <h3 className="text-xl font-bold text-green-800 mb-2">
                        🏆 Perfectionniste !
                      </h3>
                      <p className="text-green-700">
                        Vous avez complété toutes vos tâches aujourd'hui. Excellent travail !
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
