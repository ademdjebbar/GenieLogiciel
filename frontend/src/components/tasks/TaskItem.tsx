import { useState } from 'react';
import { API_URL } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Zap, 
  Clock, 
  Sparkles, 
  ChevronDown, 
  ChevronRight,
  Play,
  Square
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueDate?: string;
  isAIPriority: boolean;
  aiScore?: number;
  aiReasoning?: string;
  estimatedTime?: number;
  category?: { name: string, color: string };
  subTasks?: SubTask[];
}

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

export function TaskItem({ task, onStatusChange, onDelete, index }: TaskItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [localSubTasks, setLocalSubTasks] = useState<SubTask[]>(task.subTasks || []);
  const [tracking, setTracking] = useState(false);
  
  const isDone = task.status === 'DONE';

  const toggleSubTask = async (subTaskId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/tasks/subtasks/${subTaskId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !currentStatus })
      });

      if (res.ok) {
        setLocalSubTasks(prev => prev.map(s => s.id === subTaskId ? { ...s, completed: !currentStatus } : s));
      }
    } catch (err) {
      toast.error("Échec de la mise à jour de la sous-tâche.");
    }
  };

  const getPriorityBadge = (p: string) => {
    switch(p) {
      case 'CRITICAL': return <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-widest border border-red-500/20">Critique</span>;
      case 'HIGH': return <span className="px-2 py-1 rounded bg-orange-500/10 text-orange-400 text-[9px] font-black uppercase tracking-widest border border-orange-500/20">Haute</span>;
      case 'MEDIUM': return <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-400 text-[9px] font-black uppercase tracking-widest border border-yellow-500/20">Moyenne</span>;
      default: return <span className="px-2 py-1 rounded bg-[#ffc8dd]/10 text-[#7a6188] text-[9px] font-black uppercase tracking-widest border border-[#cdb4db]/20">Basse</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group flex flex-col hover:bg-[#cdb4db]/5 transition-colors relative"
    >
      <div className="grid grid-cols-[60px_120px_minmax(200px,1fr)_200px_140px_80px] items-center gap-4 py-3 px-4 w-full relative z-10 text-sm">
         
         {/* 1. STATUS */}
         <div className="flex justify-center">
            <button 
              onClick={() => onStatusChange(task.id, isDone ? 'TODO' : 'DONE')}
              className="w-5 h-5 flex items-center justify-center transition-transform active:scale-90"
            >
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-[#ffafcc] fill-[#ffafcc]/10" />
              ) : (
                <Circle className="w-5 h-5 text-[#9b85a8] hover:text-[#ffc8dd] transition-colors" />
              )}
            </button>
         </div>

         {/* 2. PRIORITÉ */}
         <div>
            {getPriorityBadge(task.priority)}
         </div>

         {/* 3. NOM (OPÉRATION) */}
         <div className="flex flex-col min-w-0 pr-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setExpanded(!expanded)} 
                className={cn(
                  "text-[#7a6188] hover:text-[#2d1f3d] transition-colors",
                  localSubTasks.length === 0 ? "invisible" : ""
                )}
              >
                {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              <span className={cn(
                "font-bold truncate transition-colors",
                isDone ? "text-[#7a6188] line-through" : "text-[#2d1f3d]"
              )}>
                {task.title}
              </span>
              {task.isAIPriority && <Zap size={12} className="text-[#ffafcc] fill-[#ffafcc]/20 shrink-0" />}
            </div>
            {task.category && (
              <div className="flex items-center gap-1.5 text-[9px] text-[#7a6188] font-black uppercase tracking-widest pl-7 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: task.category.color }} />
                {task.category.name}
              </div>
            )}
         </div>

         {/* 4. CHRONO TRACKER */}
         <div className="flex items-center justify-center gap-3">
            <div className="flex items-center bg-[#fef6fa]/40 border border-[#cdb4db]/20 rounded-md p-0.5 shadow-inner">
               <button 
                  onClick={() => setTracking(true)} 
                  className={cn(
                    "px-2 py-1 rounded text-[9px] font-black uppercase flex items-center gap-1 transition-all", 
                    tracking ? "bg-[#ffafcc]/20 text-[#ffc8dd] shadow-md" : "text-[#7a6188] hover:bg-[#cdb4db]/15 hover:text-[#2d1f3d]"
                  )}
               >
                  <Play size={10} className={tracking ? "fill-[#ffc8dd]" : ""} /> Start
               </button>
               <button 
                  onClick={() => setTracking(false)} 
                  className={cn(
                    "px-2 py-1 rounded text-[9px] font-black uppercase flex items-center gap-1 transition-all", 
                    !tracking ? "bg-[#cdb4db]/15 text-[#7a6188]" : "text-[#7a6188] hover:bg-red-500/20 hover:text-red-400"
                  )}
               >
                  <Square size={10} className={!tracking ? "fill-[#cdb4db]" : ""} /> Stop
               </button>
            </div>
            <span className={cn(
              "text-[11px] font-mono tracking-widest font-bold w-12 text-left",
              tracking ? "text-[#ffc8dd] animate-pulse" : "text-[#7a6188]"
            )}>
              {task.estimatedTime ? `${task.estimatedTime}M` : '00:00'}
            </span>
         </div>

         {/* 5. DEADLINE */}
         <div className="text-[11px] font-bold text-[#7a6188] flex items-center gap-2">
            <Clock size={12} className="text-[#9b85a8]" />
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
         </div>

         {/* 6. ACTIONS */}
         <div className="flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity gap-1">
            {task.aiReasoning && (
              <Button variant="ghost" size="icon" className="h-7 w-7 text-[#ffafcc] hover:bg-[#ffafcc]/10" onClick={() => toast.info(`ANALYSE IA: ${task.aiReasoning}`)}>
                <Sparkles size={12} />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7 text-[#7a6188] hover:text-red-500 hover:bg-red-500/10" onClick={() => onDelete(task.id)}>
              <Trash2 size={12} />
            </Button>
         </div>

      </div>

      {/* SOUS TÂCHES ACCORDÉON */}
      <AnimatePresence>
        {expanded && localSubTasks.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[#fef6fa]/20 border-t border-[#cdb4db]/10"
          >
            <div className="py-3 px-4 grid grid-cols-[60px_120px_minmax(200px,1fr)_200px_140px_80px] gap-4 w-full">
              {/* Offset pour correspondre strictement à la colonne "Opération" */}
              <div className="col-start-3 space-y-2">
                {localSubTasks.map(sub => (
                  <div key={sub.id} className="flex items-center gap-3 group/sub pl-7 border-l border-[#cdb4db]/30">
                    <button 
                      onClick={() => toggleSubTask(sub.id, sub.completed)}
                      className="shrink-0 transition-transform active:scale-90"
                    >
                      {sub.completed 
                        ? <CheckCircle2 size={12} className="text-[#ffafcc]" /> 
                        : <Circle size={12} className="text-[#b4a0be] hover:text-[#ffafcc] transition-colors" />
                      }
                    </button>
                    <span className={cn(
                      "text-[11px] font-bold transition-all",
                      sub.completed ? "text-[#7a6188] line-through" : "text-[#7a6188]"
                    )}>
                      {sub.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </motion.div>
  );
}
