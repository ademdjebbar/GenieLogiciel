import { Target, CalendarDays, BarChart3, ArrowRight } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { cn } from "../../utils/cn";

const AIPanel = ({ activeTab, onAction, loading }) => {
  const cards = [
    { id: "prioritize", title: "Prioriser", icon: Target, color: "bg-blue-500", api: "prioritize" },
    { id: "planning", title: "Planning", icon: CalendarDays, color: "bg-indigo-500", api: "suggestions" },
    { id: "analyze", title: "Analyser", icon: BarChart3, color: "bg-purple-500", api: "analyze" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {cards.map((card) => (
        <Card 
          key={card.id} 
          className={cn(
            "flex flex-col items-center text-center p-6 border-2 transition-all",
            activeTab === card.id ? "border-accent ring-2 ring-accent/10" : "border-transparent"
          )}
        >
          <div className={cn("p-3 rounded-2xl text-white mb-4", card.color)}>
            <card.icon size={24} />
          </div>
          <h3 className="font-bold text-text-primary dark:text-text-light mb-2">{card.title}</h3>
          <Button 
            className="w-full h-10 text-sm"
            onClick={() => onAction(card.id)}
            isLoading={loading && activeTab === card.id}
          >
            Lancer
            <ArrowRight size={14} className="ml-1.5" />
          </Button>
        </Card>
      ))}
    </div>
  );
};

export { AIPanel };
