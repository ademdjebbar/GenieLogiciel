import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({ children, className, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-[#cdb4db]/25 bg-white/60 p-6 backdrop-blur-2xl transition-all hover:bg-white/80 group shadow-xl shadow-[#cdb4db]/10",
        className
      )}
    >
      {/* Bordure de lueur dynamique */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#ffafcc]/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      {children}
    </motion.div>
  );
}
