import { Sparkles, Target, Clock, TrendingUp, CheckCircle2 } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

const AIResultCard = ({ activeTab, result }) => {
  if (!result) return null;

  return (
    <Card className="bg-white dark:bg-gray-950 p-8 border-accent/20 border-2 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-32 translate-x-32 blur-3xl pointer-events-none" />
      
      {activeTab === "prioritize" && (
        <div className="space-y-6">
          {result.taches_prioritaires?.map((item, i) => (
            <div key={i} className="flex gap-6 items-start p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 border border-transparent hover:border-accent/10 transition-all shadow-soft hover:shadow-premium group">
              <div className="flex flex-col items-center justify-center min-w-[60px] h-[60px] rounded-2xl bg-accent text-white font-black text-xl shadow-lg shadow-accent/20">
                {item.score.toFixed(1)}
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="text-xl font-bold text-text-primary dark:text-text-light">{item.titre}</h4>
                <p className="text-text-secondary dark:text-gray-400 font-medium leading-relaxed">{item.raison}</p>
                <div className="pt-2"><Badge variant="ai">Recommandé</Badge></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "planning" && (
        <div className="relative pl-12">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-800" />
          <div className="space-y-8">
            {result.planning?.map((item, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[30px] top-2 w-4 h-4 rounded-full bg-accent ring-4 ring-accent/10 border-2 border-white dark:border-gray-950 z-10" />
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-transparent hover:border-accent/10 hover:bg-white dark:hover:bg-gray-900 transition-all shadow-soft hover:shadow-premium group">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-accent" />
                    <span className="text-sm font-black text-accent">{item.heure}</span>
                  </div>
                  <h4 className="text-lg font-bold text-text-primary dark:text-text-light mb-1 group-hover:text-accent transition-colors">{item.tache}</h4>
                  <p className="text-sm text-text-secondary dark:text-gray-400 font-medium">{item.raison}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "analyze" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/20">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-emerald-500" size={24} />
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider text-xs">Taux de Complétion</h4>
              </div>
              <p className="text-4xl font-black text-emerald-600">{(result.taux_completion * 100).toFixed(0)}%</p>
            </div>
            <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20">
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-blue-500" size={24} />
                <h4 className="font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider text-xs">Catégorie Forte</h4>
              </div>
              <p className="text-4xl font-black text-blue-600">{result.categorie_forte}</p>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-text-primary dark:text-text-light flex items-center gap-2">
              <CheckCircle2 size={20} className="text-accent" />
              Insights Clés
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.insights?.map((insight, i) => (
                <li key={i} className="flex gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-sm font-medium text-text-secondary">
                  <span className="text-accent font-bold">•</span> {insight}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-accent text-white shadow-xl shadow-accent/20">
            <h4 className="font-bold flex items-center gap-2 mb-2"><Sparkles size={20} /> Conseil Priora</h4>
            <p className="font-medium">{result.conseil}</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export { AIResultCard };
