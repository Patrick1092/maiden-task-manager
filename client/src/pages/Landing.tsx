import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, getLoginUrl } from "@/const";
import { CheckCircle2, ListTodo, Target, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Landing() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [loading, isAuthenticated, setLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="container py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt="Maiden Logo" className="h-12 w-12 object-contain" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Maiden Task Manager
            </span>
          </div>
          <Button variant="outline" onClick={() => window.location.href = getLoginUrl()}>
            Se connecter
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-center">
          {/* Logo principal avec animation */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 blur-3xl opacity-30 animate-pulse"></div>
            <img 
              src={APP_LOGO} 
              alt="Maiden Task Manager" 
              className="h-32 w-32 md:h-40 md:w-40 object-contain relative z-10 drop-shadow-2xl animate-pulse-slow" 
            />
          </div>

          {/* Titre et description */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Maximisez Votre Productivité
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl">
            Gérez vos tâches avec intelligence, suivez vos progrès en temps réel et atteignez vos objectifs avec{" "}
            <span className="font-semibold text-indigo-600">Maiden Task Manager</span>
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-xl">
            Une application de gestion de tâches moderne avec gamification, analytics et suivi de productivité.
          </p>

          {/* CTA Button */}
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            onClick={() => window.location.href = getLoginUrl()}
          >
            <Target className="mr-2 h-5 w-5" />
            Commencer Maintenant
          </Button>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl">
            <div className="flex flex-col items-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-4">
                <ListTodo className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-900">Gestion Intuitive</h3>
              <p className="text-muted-foreground text-center">
                Créez, modifiez et organisez vos tâches avec une interface moderne et épurée
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-purple-900">Analytics Avancés</h3>
              <p className="text-muted-foreground text-center">
                Suivez votre productivité avec des scores quotidiens, hebdomadaires et mensuels
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-pink-900">Gamification</h3>
              <p className="text-muted-foreground text-center">
                Gagnez des badges et restez motivé avec un système de récompenses
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container py-8 text-center text-muted-foreground">
        <p>© 2025 Maiden Task Manager. Développé avec ❤️ sur Manus</p>
      </footer>
    </div>
  );
}
