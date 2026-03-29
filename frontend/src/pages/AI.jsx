import { useState } from "react";
import { Sparkles, Target, CalendarDays, BarChart3, ArrowRight, Loader2 } from "lucide-react";
import { getPrioritize, getSuggestions, getAnalyze } from "../services/api";
import { Button } from "../components/ui/Button";
import { useToast } from "../hooks/useToast";
import { AIPanel } from "../components/ai/AIPanel";
import { AIResultCard } from "../components/ai/AIResultCard";

const AI = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const { showToast } = useToast();

  const handleAIAction = async (action) => {
    setLoading(true);
    setActiveTab(action);
    setResult(null);
    try {
      let res;
      if (action === "prioritize") res = await getPrioritize();
      else if (action === "planning") res = await getSuggestions();
      else if (action === "analyze") res = await getAnalyze();
      setResult(res.data);
    } catch (err) {
      showToast("L'IA a rencontré un problème. Réessayez plus tard.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold text-sm">
          <Sparkles size={16} /> <span>Intelligence Artificielle</span>
        </div>
        <h2 className="text-4xl font-extrabold text-text-primary dark:text-text-light tracking-tight">Votre Assistant Personnel Intelligent</h2>
        <p className="text-lg text-text-secondary dark:text-gray-400 font-medium">Optimisez votre temps et restez concentré sur ce qui compte vraiment.</p>
      </div>

      <AIPanel activeTab={activeTab} onAction={handleAIAction} loading={loading} />

      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <Loader2 className="animate-spin text-accent mb-4" size={48} />
            <p className="text-lg font-bold text-text-primary dark:text-text-light">Priora réfléchit...</p>
          </div>
        ) : result ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h3 className="text-2xl font-extrabold text-text-primary dark:text-text-light mb-6 flex items-center gap-3">
              <Sparkles className="text-accent" size={28} /> Résultats de l'analyse
            </h3>
            <AIResultCard activeTab={activeTab} result={result} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <Sparkles size={64} className="text-gray-200" />
            <h4 className="text-xl font-bold text-text-primary dark:text-text-light">Prêt à commencer ?</h4>
            <p className="text-text-secondary max-w-xs">Sélectionnez une action ci-dessus pour laisser l'IA transformer votre productivité.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { AI };