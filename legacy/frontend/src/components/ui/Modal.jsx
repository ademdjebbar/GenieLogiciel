import { Fragment } from 'react'
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react'
import { X } from 'lucide-react'
import { cn } from "../../utils/cn";

const Modal = ({ isOpen, onClose, title, children, maxWidth = "md", className }) => {
  const maxWidths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-primary/5 backdrop-blur-md" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-8"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-8"
            >
              <DialogPanel className={cn(
                "w-full transform overflow-hidden rounded-[2.5rem] bg-white border border-rose-50/50 p-8 text-left align-middle shadow-premium transition-all",
                maxWidths[maxWidth],
                className
              )}>
                <div className="flex items-center justify-between mb-8">
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-bold leading-6 text-text-primary"
                  >
                    {title}
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="rounded-2xl p-2.5 text-text-secondary hover:text-primary bg-rose-50 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export { Modal };
