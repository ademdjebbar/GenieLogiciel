import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskItem } from '@/components/tasks/TaskItem';
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronDown,
  LayoutTemplate
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useModalStore } from '@/store/useModalStore';

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const { openTaskModal, taskRefreshTrigger } = useModalStore();

  useEffect(() => {
    fetchData();
  }, [taskRefreshTrigger]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, catsRes] = await Promise.all([
        fetch(`${API_URL}/api/tasks`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/categories`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const tasksData = await tasksRes.json();
      const catsData = await catsRes.json();
      setTasks(tasksData);
      setCategories(catsData);
    } catch (err) {
      toast.error("Erreur de synchronisation du Workspace.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await fetch(`${API_URL}/api/tasks/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      fetchData();
    } catch (err) {
      toast.error("Erreur opérationnelle sur le noyau.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success("Tâche supprimée.");
      fetchData();
    } catch (err) {
      toast.error("Erreur de suppression.");
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    const matchesCategory = filterCategory === 'ALL' || t.categoryId === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#ffafcc] border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black text-[#7a6188] uppercase tracking-[0.3em]">Synchronisation du Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full max-h-[calc(100vh-4rem)] flex flex-col space-y-8 overflow-hidden">

      {/* Header Elite & Global Controls */}
      <header className="shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black text-[#2d1f3d] tracking-tighter uppercase ">Workspace Hub</h1>
          <div className="flex items-center gap-3 mt-2">
             <div className="w-2 h-2 rounded-full bg-[#ffafcc] animate-pulse shadow-[0_0_10px_rgba(255,175,204,0.8)]" />
             <p className="text-[#7a6188] font-black uppercase tracking-[0.3em] text-[10px]">{filteredTasks.length} TÂCHES ACTIVES // SYNC TERMINÉE</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7a6188]" />
            <Input 
              placeholder="RECHERCHER DANS LE NOYAU..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 bg-white border-[#cdb4db]/20 rounded-2xl h-14 focus-visible:ring-[#ffafcc] font-bold uppercase tracking-widest text-xs"
            />
          </div>
          <Button onClick={() => openTaskModal()} className="bg-[#ffafcc] hover:bg-[#ffc8dd] text-[#2d1f3d] h-14 px-8 rounded-2xl font-black shadow-2xl shadow-[#ffafcc]/20 active:scale-95 transition-all">
             <Plus className="w-5 h-5 mr-2" strokeWidth={3} />
             INITIALISER
          </Button>
        </div>
      </header>

      {/* Filter Bar Elite */}
      <div className="shrink-0 flex flex-wrap items-center gap-4 border-b border-[#cdb4db]/20 pb-4">
        {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={cn(
              "text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl transition-all relative overflow-hidden",
              filterStatus === s 
                ? "bg-[#ffafcc]/10 text-[#ffafcc] border border-[#ffafcc]/20 shadow-lg shadow-[#ffafcc]/5" 
                : "text-[#7a6188] hover:text-[#7a6188] hover:bg-[#cdb4db]/15"
            )}
          >
            {s === 'ALL' ? 'TOUS LES SEGMENTS' : s.replace('_', ' ')}
            {filterStatus === s && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ffafcc]" />
            )}
          </button>
        ))}
        <div className="flex-1" />
        <div className="relative flex items-center bg-[#cdb4db]/5 border border-transparent hover:border-[#cdb4db]/20 rounded-xl transition-all">
           <Filter className="w-4 h-4 ml-4 text-[#ffafcc] absolute pointer-events-none" />
           <select 
             value={filterCategory}
             onChange={(e) => setFilterCategory(e.target.value)}
             className="appearance-none bg-transparent text-[#7a6188] hover:text-[#2d1f3d] text-[10px] font-black uppercase tracking-widest pl-12 pr-10 py-3 focus:outline-none cursor-pointer w-64"
           >
             <option value="ALL" className="bg-white">TOUS LES ESPACES</option>
             {categories.map(c => (
               <option key={c.id} value={c.id} className="bg-white">{c.name}</option>
             ))}
           </select>
           <ChevronDown className="w-4 h-4 mr-4 text-[#7a6188] absolute right-0 pointer-events-none" />
        </div>
      </div>

      {/* Workspace Area Elite (Table View) */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-10 scrollbar-hide">
        
        {/* Table Header */}
        <div className="grid grid-cols-[60px_120px_minmax(200px,1fr)_200px_140px_80px] items-center gap-4 py-3 px-4 border-b border-[#cdb4db]/30 text-[10px] font-black uppercase tracking-widest text-[#7a6188] sticky top-0 bg-[#fef6fa]/80 backdrop-blur-xl z-20 mb-2">
           <div className="text-center">Status</div>
           <div>Priorité</div>
           <div>Opération</div>
           <div className="text-center">Chrono Tracker</div>
           <div>Deadline</div>
           <div className="text-right pr-2">Actions</div>
        </div>

        <div className="flex flex-col border border-[#cdb4db]/20 rounded-2xl bg-white/20 overflow-hidden divide-y divide-white/5">
          <AnimatePresence mode="popLayout">
          {filteredTasks.map((t, i) => (
            <TaskItem 
              key={t.id} 
              task={t} 
              index={i} 
              onStatusChange={handleStatusChange} 
              onDelete={handleDelete} 
            />
          ))}
          </AnimatePresence>
        </div>

        {filteredTasks.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center bg-[#ffc8dd]/20 border border-[#cdb4db]/20 rounded-3xl relative overflow-hidden">
            <LayoutTemplate className="mx-auto text-[#cdb4db] w-20 h-20 mb-6 opacity-30" />
            <p className="text-[#7a6188] font-black uppercase tracking-[0.3em] text-[10px]">Segment Vide — Aucun processus détecté pour ces filtres.</p>
            <Button variant="link" className="text-[#ffafcc] font-black uppercase tracking-widest text-[10px] mt-6 hover:text-[#ffc8dd]" onClick={() => {setSearch(''); setFilterStatus('ALL')}}>
              RÉINITIALISER LES PROTOCOLES
            </Button>
          </motion.div>
        )}
      </div>

    </div>
  );
}
