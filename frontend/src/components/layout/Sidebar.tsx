import React from 'react';
import {
  LayoutDashboard,
  CheckCircle2,
  Calendar,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BarChart3,
  Command,
  Flower2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Tableau de Bord', icon: LayoutDashboard, path: '/' },
  { name: 'Workspace', icon: CheckCircle2, path: '/tasks' },
  { name: 'Calendrier', icon: Calendar, path: '/calendar' },
  { name: 'IA Studio', icon: Sparkles, path: '/ai' },
  { name: 'Rapports', icon: BarChart3, path: '/stats' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className={cn(
      "h-screen bg-white/70 backdrop-blur-xl border-r border-[#cdb4db]/20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col relative z-30 items-center",
      collapsed ? "w-20" : "w-64"
    )}>

      <div className={cn("p-6 w-full flex items-center mb-4 transition-all", collapsed ? "justify-center" : "gap-3.5")}>
        <div className="w-10 h-10 bg-gradient-to-br from-[#ffafcc] to-[#a2d2ff] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-[#ffafcc]/20 transition-transform hover:scale-105 hover:rotate-3">
          <Flower2 className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <h2 className="font-extrabold text-lg tracking-tight text-[#2d1f3d] leading-none">Priora</h2>
            <span className="text-[9px] font-bold tracking-[0.15em] text-[#cdb4db] uppercase mt-0.5">Gestion de tâches</span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1 w-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-[#ffafcc]/15 text-[#2d1f3d]"
                  : "text-[#7a6188] hover:bg-[#cdb4db]/10 hover:text-[#2d1f3d]"
              )}
            >
              <item.icon className={cn("w-[18px] h-[18px] transition-all z-10 shrink-0", isActive ? "text-[#ffafcc]" : "group-hover:text-[#cdb4db]")} />
              {!collapsed && <span className="font-semibold text-[13px] z-10">{item.name}</span>}

              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#ffafcc] rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#cdb4db]/15 space-y-3 w-full">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2.5 bg-gradient-to-r from-[#ffc8dd]/15 to-[#bde0fe]/15 rounded-xl border border-[#cdb4db]/10 mb-1 cursor-pointer group/user hover:from-[#ffc8dd]/25 hover:to-[#bde0fe]/25 transition-all">
            <div className="w-8 h-8 bg-gradient-to-br from-[#ffafcc] to-[#a2d2ff] rounded-lg flex items-center justify-center shrink-0 group-hover/user:scale-105 transition-transform">
              <span className="text-xs font-bold text-white">{user.name?.charAt(0)}</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#2d1f3d] truncate">{user.name}</span>
              <span className="text-[10px] text-[#7a6188] truncate">{user.email}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-0.5 w-full">
          <Button
            variant="ghost"
            onClick={() => navigate('/settings')}
            className={cn("w-full justify-start text-[#7a6188] hover:text-[#2d1f3d] px-3 py-5 hover:bg-[#cdb4db]/10 rounded-xl transition-all", collapsed && "justify-center")}
          >
            <Settings className="w-4 h-4" />
            {!collapsed && <span className="ml-2.5 font-semibold text-xs">Paramètres</span>}
          </Button>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn("w-full justify-start text-[#7a6188] hover:text-[#e8566d] px-3 py-5 hover:bg-[#e8566d]/5 rounded-xl transition-all", collapsed && "justify-center")}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="ml-2.5 font-semibold text-xs">Déconnexion</span>}
          </Button>
        </div>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-[#cdb4db]/25 rounded-full flex items-center justify-center text-[#7a6188] hover:text-[#ffafcc] transition-all shadow-md hover:scale-110 z-50"
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>

      {!collapsed && (
        <div className="pb-6 w-full px-6 text-[9px] font-semibold text-[#cdb4db] tracking-widest flex items-center gap-1.5">
          <Command size={9} />
          <span>CMD+K</span>
        </div>
      )}
    </div>
  );
}
