import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Select = forwardRef(({ label, error, options = [], className, ...props }, ref) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-bold text-text-primary ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "w-full bg-white border-2 border-gray-100 hover:border-accent/40 rounded-[1.2rem] px-5 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-accent/20 transition-all duration-300 text-text-primary appearance-none text-base font-medium cursor-pointer shadow-sm",
            error && "border-danger focus:ring-danger/20 focus:border-danger text-danger",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-xs font-bold text-danger ml-2 mt-1.5 animate-in fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = "Select";
export { Select };
