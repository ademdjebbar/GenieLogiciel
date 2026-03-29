import { cn } from "../../utils/cn";

const Skeleton = ({ className, variant = "default" }) => {
  const variants = {
    default: "bg-gray-200 dark:bg-gray-800 rounded-md",
    circle: "bg-gray-200 dark:bg-gray-800 rounded-full",
    shimmer: "animate-shimmer rounded-md",
  };

  return (
    <div
      className={cn(
        "animate-pulse",
        variants[variant],
        className
      )}
    />
  );
};

export { Skeleton };
