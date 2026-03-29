import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, CheckSquare, Sparkles, Settings, LogOut, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";
import { motion } from "framer-motion";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); navigate("/login");
  };

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Vue d'ensemble" },
    { to: "/tasks", icon: CheckSquare, label: "Tâches" },
    { to: "/ai", icon: Sparkles, label: "Assistant IA" },
    { to: "/settings", icon: Settings, label: "Paramètres" },
  ];

  const sidebarClasses = cn(
    "fixed inset-y-0 left-0 z-40 w-72 bg-white/80 backdrop-blur-3xl border-r border-rose-50/50 transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col shadow-soft",
    !isOpen && "-translate-x-full"
  );

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-sm z-30 md:hidden animate-in fade-in" onClick={toggleSidebar} />
      )}
      <aside className={sidebarClasses}>
        <div className="h-24 px-8 flex items-center justify-between border-b border-rose-50/50">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, type: "spring" }} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-[1rem] font-bold text-lg leading-none shadow-sm">
              <Sparkles size={20} className="text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-text-primary">
              Priora
            </span>
          </motion.div>
          <button className="md:hidden text-text-secondary hover:text-primary bg-rose-50 p-2 rounded-xl" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-6 py-8 space-y-2">
          {navItems.map((item, i) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + (i * 0.05), type: "spring", stiffness: 300 }}
            >
              <NavLink
                to={item.to}
                onClick={() => window.innerWidth < 768 && toggleSidebar()}
                className={({ isActive }) => cn(
                  "flex items-center gap-4 px-4 py-4 rounded-[1.2rem] transition-all duration-300 text-base font-bold",
                  isActive
                    ? "bg-primary text-white shadow-soft"
                    : "text-text-secondary hover:bg-rose-50 hover:text-primary border border-transparent hover:border-accent/20"
                )}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, type: "spring" }}
          className="p-6 border-t border-rose-50/50"
        >
          <div className="flex items-center gap-4 p-4 mb-4 rounded-[1.2rem] bg-rose-50/50 border border-rose-100/50 shadow-sm">
            <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-tr from-accent to-primary shadow-soft flex items-center justify-center text-white text-base font-bold">
              {user?.prenom?.[0] || 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-base font-bold text-text-primary truncate">
                {user?.prenom}
              </p>
              <p className="text-sm font-medium text-text-secondary truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 px-4 py-4 rounded-[1.2rem] text-text-secondary hover:bg-rose-50 hover:text-danger transition-all text-base font-bold border border-transparent hover:border-danger/20"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </motion.div>
      </aside>
    </>
  );
};
export { Sidebar };
