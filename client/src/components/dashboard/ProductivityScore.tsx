import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProductivityScoreProps {
  score: number;
  total: number;
  completed: number;
  period: "daily" | "weekly" | "monthly";
}

const periodLabels = {
  daily: "Aujourd'hui",
  weekly: "Cette semaine",
  monthly: "Ce mois",
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
};

const getScoreMessage = (score: number) => {
  if (score === 100) return "Parfait ! 🎉";
  if (score >= 80) return "Excellent travail ! 🌟";
  if (score >= 60) return "Bon progrès ! 👍";
  if (score >= 40) return "Continue ! 💪";
  if (score > 0) return "On y va ! 🚀";
  return "Commencez maintenant ! ⚡";
};

export function ProductivityScore({ score, total, completed, period }: ProductivityScoreProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle>Score de Productivité</CardTitle>
        <CardDescription>{periodLabels[period]}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
            {score}%
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {getScoreMessage(score)}
          </p>
        </div>
        
        <Progress value={score} className="h-3" />
        
        <div className="flex justify-between text-sm">
          <div className="text-center">
            <div className="font-semibold text-lg">{completed}</div>
            <div className="text-muted-foreground">Complétées</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">{total - completed}</div>
            <div className="text-muted-foreground">Restantes</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">{total}</div>
            <div className="text-muted-foreground">Total</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
