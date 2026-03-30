import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { motion } from "framer-motion";

const Button = forwardRef(({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  ...props
}, ref) => {
  const variants = {
    primary: "bg-primary text-white shadow-soft hover:shadow-rose-glow hover:bg-primary-dark transition-all duration-300 font-bold",
    secondary: "bg-transparent text-primary border-2 border-accent hover:bg-rose-50 transition-all duration-300 font-bold",
    danger: "bg-danger text-white shadow-soft hover:bg-rose-600 transition-all duration-300 font-bold",
    ghost: "bg-transparent text-text-secondary hover:bg-rose-50 hover:text-primary transition-all duration-300 font-bold",
    outline: "bg-white text-text-primary border-2 border-gray-100 hover:border-accent hover:text-primary shadow-sm transition-all duration-300 font-bold",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-[1rem]",
    md: "px-6 py-3 text-base rounded-[1.2rem]",
    lg: "px-8 py-4 text-lg rounded-[1.5rem]",
    icon: "p-3 rounded-[1rem]",
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: props.disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: props.disabled || isLoading ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      disabled={isLoading || props.disabled}
      className={cn(
        "inline-flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      <span className="flex items-center gap-2">{children}</span>
    </motion.button>
  );
});

Button.displayName = "Button";

export { Button };
