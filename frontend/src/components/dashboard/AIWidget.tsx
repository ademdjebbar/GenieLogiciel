import { motion } from 'framer-motion';
import { Sparkles, BrainCircuit, Activity, ChevronRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';

interface AIWidgetProps {
  score: number;
  recommendation: { title: string, reason: string } | null;
}

export function AIWidget({ score, recommendation }: AIWidgetProps) {
  return (
    <GlassCard className="h-full flex flex-col justify-between overflow-hidden relative">
      <div className="absolute -top-4 -right-4 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity">
        <BrainCircuit size={140} className="text-[#a2d2ff]" />
      </div>

      <div className="z-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-gradient-to-br from-[#bde0fe]/30 to-[#a2d2ff]/30 rounded-xl flex items-center justify-center border border-[#a2d2ff]/20">
            <Sparkles className="w-4 h-4 text-[#a2d2ff]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#2d1f3d]">Assistant IA</h3>
            <p className="text-[10px] text-[#cdb4db] font-semibold">Optimisation active</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-semibold text-[#7a6188] uppercase tracking-wider">Score de productivité</span>
              <span className="text-xl font-extrabold text-[#2d1f3d]">{score}%</span>
            </div>
            <div className="h-2 w-full bg-[#cdb4db]/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#ffafcc] via-[#ffc8dd] to-[#a2d2ff] rounded-full"
              />
            </div>
          </div>

          <div className="space-y-2.5 bg-[#ffc8dd]/8 p-4 rounded-xl border border-[#ffc8dd]/15 group-hover:border-[#ffafcc]/25 transition-all">
            <div className="flex items-center gap-2 text-[#7a6188] text-[10px] font-semibold uppercase tracking-wider">
              <Activity size={12} className="text-[#a2d2ff]" />
              Prochaine étape
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#2d1f3d]">
                {recommendation?.title || "Analysez vos tâches..."}
              </p>
              <p className="text-[11px] text-[#7a6188] leading-relaxed">
                {recommendation?.reason || "Ajoutez des tâches pour activer l'optimisation IA."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button variant="ghost" className="w-full mt-4 justify-between text-[#7a6188] hover:text-[#2d1f3d] py-5 hover:bg-[#cdb4db]/8 rounded-xl transition-all">
        <span className="text-xs font-semibold">Planification IA</span>
        <ChevronRight size={14} />
      </Button>
    </GlassCard>
  );
}
