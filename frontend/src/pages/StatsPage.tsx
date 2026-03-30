import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api';
import {
  XAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Zap,
  CheckCircle2,
  Clock,
  Activity,
  Target,
  BarChart3,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const COLORS = ['#ffafcc', '#a2d2ff'];

interface Task {
  id: string;
  status: string;
  isAIPriority: boolean;
  aiReasoning?: string;
  title: string;
  estimatedTime?: number;
  priority: string;
  subTasks?: any[];
  updatedAt: string;
}

export default function StatsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Impossible de charger l'analyse.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (tasks.length === 0) { toast.error("Aucune donnée."); return; }
    const csv = "data:text/csv;charset=utf-8,"
      + "Titre,Statut,Priorite,IA,Temps Estime,Sous-taches\n"
      + tasks.map(t => `"${t.title}",${t.status},${t.priority},${t.isAIPriority ? 'Oui' : 'Non'},${t.estimatedTime || 0},${t.subTasks ? t.subTasks.length : 0}`).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", "priora_rapport.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Rapport exporté.");
  };

  const doneTasks = tasks.filter(t => t.status === 'DONE');
  const todoTasks = tasks.filter(t => t.status !== 'DONE');
  const productivityScore = tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0;
  const totalMin = doneTasks.reduce((a, t) => a + (t.estimatedTime || 0), 0);
  const timeSaved = totalMin >= 60 ? `${(totalMin / 60).toFixed(1)}h` : `${totalMin}min`;

  const now = new Date();
  const startWeek = new Date(now); startWeek.setDate(now.getDate() - now.getDay()); startWeek.setHours(0,0,0,0);
  const startLastWeek = new Date(startWeek); startLastWeek.setDate(startLastWeek.getDate() - 7);
  const thisWeek = doneTasks.filter(t => t.updatedAt && new Date(t.updatedAt) >= startWeek).length;
  const lastWeek = doneTasks.filter(t => { if (!t.updatedAt) return false; const d = new Date(t.updatedAt); return d >= startLastWeek && d < startWeek; }).length;
  const velocity = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : thisWeek > 0 ? 100 : 0;

  const statusData = [
    { name: 'Complétées', value: doneTasks.length },
    { name: 'En cours', value: todoTasks.length },
  ];

  const weeklyData = (() => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      return { name: days[d.getDay()], completed: doneTasks.filter(t => t.updatedAt && new Date(t.updatedAt).toDateString() === d.toDateString()).length };
    });
  })();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#ffafcc] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#cdb4db]">Analyse en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4 pb-2">

      {/* Header */}
      <header className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2d1f3d] flex items-center gap-2">
            Rapports <BarChart3 className="text-[#ffafcc] w-6 h-6" />
          </h1>
          <p className="text-xs text-[#7a6188] font-semibold mt-0.5">Analyse de performance</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="border-[#cdb4db]/20 bg-white/60 text-[#7a6188] hover:text-[#2d1f3d] text-xs font-semibold px-4 py-2 rounded-xl hover:bg-white">
          <Download className="w-3.5 h-3.5 mr-1.5" /> Exporter CSV
        </Button>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 shrink-0">
        {[
          { label: "Productivité", val: `${productivityScore}%`, icon: Zap, iconColor: "text-[#ffafcc]", bg: "bg-[#ffafcc]/10" },
          { label: "Complétées", val: doneTasks.length, icon: CheckCircle2, iconColor: "text-[#a2d2ff]", bg: "bg-[#bde0fe]/15" },
          { label: "Temps gagné", val: timeSaved, icon: Clock, iconColor: "text-[#cdb4db]", bg: "bg-[#cdb4db]/10" },
          { label: "Vélocité", val: `${velocity >= 0 ? '+' : ''}${velocity}%`, icon: TrendingUp, iconColor: "text-[#ffc8dd]", bg: "bg-[#ffc8dd]/10" },
        ].map((s, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-sm border border-[#cdb4db]/15 rounded-xl p-3 flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", s.bg)}>
              <s.icon className={cn("w-4 h-4", s.iconColor)} />
            </div>
            <div>
              <p className="text-[9px] font-semibold text-[#cdb4db] uppercase tracking-wider">{s.label}</p>
              <p className="text-lg font-extrabold text-[#2d1f3d]">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">

        {/* Area Chart */}
        <div className="col-span-2 bg-white/50 backdrop-blur-sm border border-[#cdb4db]/15 rounded-xl p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3 shrink-0">
            <Activity className="text-[#ffafcc] w-4 h-4" />
            <h3 className="text-xs font-bold text-[#2d1f3d]">Activité hebdomadaire</h3>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffafcc" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ffafcc" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#cdb4db', fontSize: 10, fontWeight: 600 }}
                  dy={8}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(205,180,219,0.2)', borderRadius: '10px', fontSize: '11px', fontWeight: '600', boxShadow: '0 4px 12px rgba(205,180,219,0.1)' }}
                  itemStyle={{ color: '#ffafcc' }}
                  cursor={{ stroke: '#cdb4db', strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#ffafcc"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorProd)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="col-span-1 bg-white/50 backdrop-blur-sm border border-[#cdb4db]/15 rounded-xl p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3 shrink-0">
            <Target className="text-[#a2d2ff] w-4 h-4" />
            <h3 className="text-xs font-bold text-[#2d1f3d]">Répartition</h3>
          </div>
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="80%"
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} stroke="white" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 shrink-0">
            {statusData.map((item, i) => (
              <div key={i} className="flex flex-col p-2 bg-[#cdb4db]/8 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-[9px] font-semibold text-[#7a6188]">{item.name}</span>
                </div>
                <span className="text-lg font-extrabold text-[#2d1f3d] mt-0.5">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
