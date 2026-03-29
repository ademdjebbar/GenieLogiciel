import { cn } from "../../utils/cn";

const Badge = ({ children, variant = "default", className }) => {
  const variants = {
    default: "bg-white text-text-primary border border-gray-100 shadow-sm",
    primary: "bg-rose-50 text-primary border border-primary/20",
    success: "bg-emerald-50 text-success border border-success/20",
    warning: "bg-amber-50 text-warning border border-warning/20",
    danger: "bg-rose-50 text-danger border border-danger/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-[1rem] text-xs font-bold tracking-tight",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export { Badge };
