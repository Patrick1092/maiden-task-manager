import { Badge } from "@/components/ui/badge";

type Priority = "high" | "medium" | "low";

interface PriorityBadgeProps {
  priority: Priority;
}

const priorityConfig = {
  high: {
    label: "Haute",
    className: "bg-red-500 text-white hover:bg-red-600",
  },
  medium: {
    label: "Moyenne",
    className: "bg-yellow-500 text-white hover:bg-yellow-600",
  },
  low: {
    label: "Basse",
    className: "bg-blue-500 text-white hover:bg-blue-600",
  },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <Badge className={config.className} variant="default">
      {config.label}
    </Badge>
  );
}
