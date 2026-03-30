import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api';
import { motion } from 'framer-motion';
import { AIWidget } from '@/components/dashboard/AIWidget';
import { TaskItem } from '@/components/tasks/TaskItem';
import {
  Plus,
  Search,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCheck,
  LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';
import { toast } from 'sonner';
import { useModalStore } from '@/store/useModalStore';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const { openTaskModal, setCommandPaletteOpen, taskRefreshTrigger } = useModalStore();
  const navigate = useNavigate();

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
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      toast.error("Erreur de mise à jour.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      toast.error("Erreur de suppression.");
    }
  };

  const doneTasks = tasks.filter(t => t.status === 'DONE');
  const aiTasks = tasks.filter(t => t.isAIPriority && t.status !== 'DONE').slice(0, 3);
  const doneCount = doneTasks.length;
  const productivityScore = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  const calculateWeeklyData = () => {
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const completedOnDay = doneTasks.filter(t => {
        if (!t.updatedAt) return false;
        return new Date(t.updatedAt).toDateString() === d.toDateString();
      }).length;
      data.push({ name: dayNames[d.getDay()], val: completedOnDay });
    }
    return data;
  };

  const chartData = calculateWeeklyData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#ffafcc] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#cdb4db]">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <p className="text-xs font-semibold text-[#cdb4db] mb-1">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="text-3xl font-extrabold text-[#2d1f3d] tracking-tight">
            Bonjour, <span className="bg-gradient-to-r from-[#ffafcc] to-[#a2d2ff] bg-clip-text text-transparent">{user.name?.split(' ')[0]}</span>
          </h1>
        </motion.div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setCommandPaletteOpen(true)} className="border-[#cdb4db]/20 bg-white/60 text-[#7a6188] hover:text-[#2d1f3d] px-5 py-5 rounded-xl transition-all hover:bg-white">
            <Search className="w-4 h-4 mr-2" />
            <span className="text-xs font-semibold">Rechercher</span>
          </Button>
          <Button onClick={() => openTaskModal()} className="bg-gradient-to-r from-[#ffafcc] to-[#ffc8dd] hover:from-[#ffc8dd] hover:to-[#ffafcc] text-[#2d1f3d] px-6 py-5 rounded-xl shadow-lg shadow-[#ffafcc]/15 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="w-4 h-4 mr-2" strokeWidth={2.5} />
            Nouvelle tâche
          </Button>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/60 backdrop-blur-sm border border-[#cdb4db]/15 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/80 transition-all group">
          <div className="w-10 h-10 bg-[#ffafcc]/15 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <CheckCheck className="text-[#ffafcc] w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[#cdb4db] uppercase tracking-wider">Complétées</p>
            <p className="text-2xl font-extrabold text-[#2d1f3d]">{doneCount}</p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm border border-[#cdb4db]/15 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/80 transition-all group">
          <div className="w-10 h-10 bg-[#bde0fe]/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <TrendingUp className="text-[#a2d2ff] w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[#cdb4db] uppercase tracking-wider">Productivité</p>
            <p className="text-2xl font-extrabold text-[#2d1f3d]">{productivityScore}%</p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm border border-[#cdb4db]/15 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/80 transition-all group">
          <div className="w-10 h-10 bg-[#cdb4db]/15 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sparkles className="text-[#cdb4db] w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[#cdb4db] uppercase tracking-wider">IA Priorités</p>
            <p className="text-2xl font-extrabold text-[#2d1f3d]">{aiTasks.length}</p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm border border-[#cdb4db]/15 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/80 transition-all group">
          <div className="w-10 h-10 bg-[#ffc8dd]/15 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <LayoutGrid className="text-[#ffc8dd] w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[#cdb4db] uppercase tracking-wider">Total</p>
            <p className="text-2xl font-extrabold text-[#2d1f3d]">{tasks.length}</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* AI Widget */}
        <div className="lg:col-span-1">
          <AIWidget
            score={productivityScore}
            recommendation={aiTasks.length > 0 ? { title: aiTasks[0].title, reason: aiTasks[0].aiReasoning || "Optimisation détectée par analyse du workflow." } : null}
          />
        </div>

        {/* Focus Hub */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#2d1f3d] flex items-center gap-2">
              Priorités du jour
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffafcc] animate-pulse" />
            </h2>
            <Button variant="ghost" onClick={() => navigate('/tasks')} className="text-[#7a6188] hover:text-[#2d1f3d] font-semibold text-xs px-3 hover:bg-[#cdb4db]/10 transition-all rounded-lg">
              Tout voir <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="overflow-x-auto">
            {aiTasks.length > 0 ? (
              <div className="min-w-[700px] flex flex-col border border-[#cdb4db]/15 rounded-2xl bg-white/50 backdrop-blur-sm divide-y divide-[#cdb4db]/10">
                {aiTasks.map((t, i) => (
                  <TaskItem
                    key={t.id}
                    task={t}
                    index={i}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white/50 border border-[#cdb4db]/15 rounded-2xl text-center py-16 group relative overflow-hidden backdrop-blur-sm">
                <LayoutGrid className="mx-auto text-[#cdb4db]/40 group-hover:text-[#ffafcc]/60 transition-colors w-12 h-12 mb-4" />
                <p className="text-[#7a6188] font-semibold text-sm">Aucune priorité en cours</p>
                <Button variant="link" onClick={() => openTaskModal()} className="text-[#ffafcc] mt-2 font-bold text-xs">
                  Créer une tâche
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Chart + CTA */}
      <div className="grid lg:grid-cols-4 gap-5">
        <div className="bg-white/50 backdrop-blur-sm border border-[#cdb4db]/15 rounded-2xl lg:col-span-3 h-48 flex flex-col justify-end px-6 pb-4 overflow-hidden relative">
          <div className="absolute top-5 left-6 z-10">
            <h3 className="text-sm font-bold text-[#2d1f3d] flex items-center gap-2">
              Activité de la semaine
              <span className="w-1.5 h-1.5 rounded-full bg-[#a2d2ff]" />
            </h3>
          </div>
          <div className="h-24 w-full z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <Bar dataKey="val" fill="#ffafcc" radius={[6, 6, 0, 0]} opacity={0.6} />
                <Tooltip
                  cursor={{ fill: 'rgba(205,180,219,0.08)' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(205,180,219,0.2)', borderRadius: '12px', fontSize: '11px', fontWeight: '600', boxShadow: '0 4px 12px rgba(205,180,219,0.1)' }}
                  itemStyle={{ color: '#ffafcc' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#ffafcc]/10 to-[#bde0fe]/10 border border-[#cdb4db]/15 rounded-2xl lg:col-span-1 p-6 flex flex-col justify-center items-center text-center group overflow-hidden relative">
          <Sparkles className="text-[#ffafcc] w-8 h-8 mb-4 group-hover:rotate-12 transition-transform" />
          <h4 className="text-xs font-bold text-[#2d1f3d] mb-2">Studio IA</h4>
          <p className="text-[11px] text-[#7a6188] mb-4 leading-relaxed">
            Optimisez vos tâches avec l'intelligence artificielle.
          </p>
          <Button size="sm" onClick={() => navigate('/ai')} className="w-full bg-white text-[#2d1f3d] font-bold text-xs py-4 rounded-xl shadow-sm hover:bg-[#ffc8dd]/20 transition-all border border-[#cdb4db]/15">
            Ouvrir le studio
          </Button>
        </div>
      </div>

    </div>
  );
}
