import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Input = forwardRef(({ label, error, icon: Icon, className, ...props }, ref) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-bold text-text-primary ml-1">
          {label}
        </label>
      )}
      <div className="relative group/input">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary transition-colors duration-300 group-focus-within/input:text-primary">
            <Icon size={20} />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-white border-2 border-gray-100 hover:border-accent/40 rounded-[1.2rem] px-5 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-accent/20 transition-all duration-300 text-text-primary placeholder:text-gray-400 text-base font-medium shadow-sm",
            Icon && "pl-12",
            error && "border-danger focus:ring-danger/20 focus:border-danger text-danger",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs font-bold text-danger ml-2 mt-1.5 animate-in fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
