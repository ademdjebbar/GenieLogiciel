import { Menu, Bell, User } from "lucide-react";
import { motion } from "framer-motion";

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="sticky top-0 z-20 h-24 bg-white/70 backdrop-blur-3xl border-b border-rose-50/50 flex items-center justify-between px-6 md:px-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-3 rounded-[1rem] bg-rose-50 hover:bg-rose-100 text-text-primary transition-colors"
        >
          <Menu size={20} />
        </button>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="hidden md:flex items-center">
          <h1 className="text-xl font-bold text-text-primary">Que faisons-nous aujourd'hui ?</h1>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-5">
        <button className="w-12 h-12 rounded-[1rem] bg-white border border-rose-50 shadow-sm flex items-center justify-center text-text-secondary hover:text-primary hover:border-accent/30 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white"></span>
        </button>
        <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-tr from-accent to-primary flex items-center justify-center cursor-pointer shadow-soft hover:shadow-rose-glow transition-all">
          <User size={20} className="text-white" />
        </div>
      </motion.div>
    </header>
  );
};

export { Header };
