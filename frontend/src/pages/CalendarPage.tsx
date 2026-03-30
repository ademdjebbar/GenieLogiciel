import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api';
import { motion } from 'framer-motion';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Sparkles,
  Zap,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useModalStore } from '@/store/useModalStore';

interface Task {
  id: string;
  title: string;
  isAIPriority: boolean;
  dueDate: string | null;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const { openTaskModal, taskRefreshTrigger } = useModalStore();

  useEffect(() => {
    fetchTasks();
  }, [taskRefreshTrigger]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      toast.error("Erreur de synchronisation du calendrier.");
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#ffafcc] border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black text-[#7a6188] uppercase tracking-[0.3em]">Synchronisation du Calendrier...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full max-h-[calc(100vh-4rem)] flex flex-col gap-6 overflow-hidden">

      {/* Header Elite avec Navigation */}
      <header className="flex shrink-0 flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#2d1f3d] tracking-tighter flex items-center gap-5">
            Calendrier
            <div className="flex items-center gap-2 text-[10px] font-black text-[#ffc8dd] bg-[#ffafcc]/10 px-3 py-1.5 rounded-full border border-[#ffafcc]/20 uppercase tracking-[0.2em]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ffafcc] animate-pulse" />
              Elite Sync
            </div>
          </h1>
          <p className="text-[#7a6188] font-bold mt-2 uppercase tracking-widest text-sm">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-[#ffc8dd]/15 p-1.5 rounded-2xl border border-[#cdb4db]/20 shadow-2xl">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="text-[#7a6188] hover:text-[#2d1f3d] hover:bg-[#cdb4db]/15 h-10 w-10 rounded-xl">
              <ChevronLeft size={20} />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="text-[#7a6188] hover:text-[#2d1f3d] hover:bg-[#cdb4db]/15 h-10 w-10 rounded-xl">
              <ChevronRight size={20} />
            </Button>
          </div>
          <Button onClick={() => openTaskModal()} className="bg-[#ffafcc] hover:bg-[#ffc8dd] text-[#2d1f3d] font-black px-6 py-5 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 text-xs">
            <Plus className="w-4 h-4 mr-2" strokeWidth={3} /> PLANIFIER
          </Button>
        </div>
      </header>

      {/* Grid du Calendrier Elite */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden border border-[#cdb4db]/20 bg-[#fef6fa]/20 backdrop-blur-3xl relative rounded-3xl">
        
        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 border-b border-[#cdb4db]/20 bg-[#cdb4db]/3">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
            <div key={day} className="py-5 text-center text-[11px] font-black text-[#7a6188] uppercase tracking-[0.3em]">
              {day}
            </div>
          ))}
        </div>

        {/* Jours du mois */}
        <div className="flex-1 min-h-0 grid grid-cols-7" style={{ gridTemplateRows: `repeat(${calendarDays.length / 7}, minmax(0, 1fr))` }}>
          {calendarDays.map((day) => {
            const dayTasks = tasks.filter((t: Task) => t.dueDate && isSameDay(new Date(t.dueDate), day));
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, monthStart);

            return (
              <div
                key={day.toString()}
                onClick={() => isCurrentMonth && openTaskModal({ title: "", dueDate: day })}
                className={cn(
                  "relative border-r border-b border-white/[0.03] p-2 flex flex-col min-h-0 transition-all group/day overflow-hidden",
                  !isCurrentMonth ? "bg-[#fef6fa]/40 opacity-20" : "hover:bg-[#cdb4db]/5 cursor-pointer",
                  isToday ? "bg-[#ffafcc]/5" : ""
                )}
              >
                <div className="flex justify-between items-start mb-2 shrink-0">
                   <span className={cn(
                     "text-xs font-black h-7 w-7 flex items-center justify-center rounded-xl transition-all",
                     isToday ? "bg-[#ffafcc] text-[#2d1f3d] scale-110" : "text-[#9b85a8] group-hover/day:text-[#7a6188]"
                   )}>
                     {format(day, 'd')}
                   </span>
                   {dayTasks.length > 0 && isCurrentMonth && (
                     <div className="w-1.5 h-1.5 rounded-full bg-[#ffafcc] animate-pulse mt-1" />
                   )}
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 scrollbar-hide pr-1">
                  {dayTasks.map((task: Task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={(e) => { e.stopPropagation(); openTaskModal({ id: task.id, title: task.title, dueDate: task.dueDate ? new Date(task.dueDate) : undefined }); }}
                      className={cn(
                        "text-[10px] px-3 py-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer font-bold tracking-tight",
                        task.isAIPriority
                          ? "bg-[#ffafcc]/10 border-[#ffafcc]/20 text-[#cdb4db] shadow-lg shadow-[#ffafcc]/5"
                          : "bg-[#ffc8dd]/25 border-[#cdb4db]/20 text-[#7a6188] hover:text-[#2d1f3d] hover:border-[#cdb4db]/30"
                      )}
                    >
                      {task.isAIPriority && <Zap size={10} fill="currentColor" className="text-[#ffc8dd] shrink-0" />}
                      <span className="truncate flex-1">{task.title}</span>
                    </motion.div>
                  ))}
                </div>

                {isCurrentMonth && (
                  <button className="absolute bottom-3 right-3 opacity-0 group-hover/day:opacity-100 transition-all p-2 bg-[#cdb4db]/15 hover:bg-[#ffafcc] hover:text-[#2d1f3d] rounded-xl text-[#7a6188] shadow-xl">
                    <Plus size={16} strokeWidth={3} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Elite avec Widgets */}
      <footer className="shrink-0 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#ffc8dd]/20 border border-[#cdb4db]/20 rounded-3xl md:col-span-2 p-5 flex items-center justify-between group overflow-hidden relative">
           <div className="absolute top-0 right-0 p-6 opacity-[0.02] -rotate-12">
              <Sparkles size={120} className="text-[#ffafcc]" />
           </div>
           
           <div className="flex items-center gap-8 z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#ffafcc]/10 flex items-center justify-center border border-[#ffafcc]/20 transition-transform group-hover:scale-110 shadow-xl">
                 <Sparkles className="text-[#ffafcc] w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-[#2d1f3d] uppercase tracking-widest">Optimisation IA</h4>
                <p className="text-[10px] text-[#7a6188] font-bold max-w-sm leading-relaxed">Mercredi surchargé. Déplacement de 2 tâches suggéré.</p>
              </div>
           </div>
           
           <div className="flex gap-4 z-10">
              <Button variant="outline" onClick={() => toast.success("Réorganisation de la timeline programmée.")} className="border-[#cdb4db]/20 bg-[#cdb4db]/15 hover:bg-[#ffafcc] hover:text-[#2d1f3d] transition-all rounded-2xl font-black text-[10px] uppercase px-8 h-12 tracking-widest">
                <RotateCcw className="w-4 h-4 mr-2" /> RÉORGANISER
              </Button>
           </div>
        </div>

        <div className="bg-[#ffc8dd]/20 border border-[#cdb4db]/20 rounded-3xl p-5 flex flex-col justify-center items-center text-center">
            <CalendarIcon size={24} className="text-[#b4a0be] mb-2" />
            <p className="text-[9px] font-black tracking-[0.3em] text-[#7a6188] uppercase">Prochain Événement</p>
            <p className="text-sm font-bold text-[#2d1f3d] mt-1 tracking-tight">Lancement Priora OS v2</p>
        </div>
      </footer>

    </div>
  );
}
