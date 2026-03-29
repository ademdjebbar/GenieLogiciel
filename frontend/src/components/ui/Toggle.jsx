import { Switch } from '@headlessui/react'
import { cn } from "../../utils/cn";

const Toggle = ({ checked, onChange, label, className }) => {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      {label && (
        <span className="text-sm font-medium text-text-primary dark:text-text-light/80">
          {label}
        </span>
      )}
      <Switch
        checked={checked}
        onChange={onChange}
        className={cn(
          "group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:bg-gray-700",
          checked && "bg-accent dark:bg-accent"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </Switch>
    </div>
  )
}

export { Toggle };
