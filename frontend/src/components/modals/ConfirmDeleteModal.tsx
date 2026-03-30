import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/useModalStore";
import { AlertTriangle } from "lucide-react";

export function ConfirmDeleteModal() {
  const { 
    isConfirmDeleteOpen, 
    closeConfirmDelete, 
    confirmDeleteTitle, 
    confirmDeleteMessage, 
    confirmDeleteAction 
  } = useModalStore();

  const handleConfirm = () => {
    if (confirmDeleteAction) {
      confirmDeleteAction();
    }
    closeConfirmDelete();
  };

  return (
    <Dialog open={isConfirmDeleteOpen} onOpenChange={(open) => !open && closeConfirmDelete()}>
      <DialogContent className="bg-white/90 backdrop-blur-xl border-red-500/20 p-8 sm:rounded-[2rem] max-w-md overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none -rotate-12">
           <AlertTriangle size={120} className="text-red-500" />
        </div>
        
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-widest text-red-500 flex items-center gap-3">
            <AlertTriangle size={20} />
            {confirmDeleteTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
           <p className="text-[#7a6188] font-bold leading-relaxed text-sm">
             {confirmDeleteMessage}
           </p>
        </div>

        <div className="pt-10 flex items-center justify-end gap-4 z-10 relative">
          <Button variant="ghost" onClick={closeConfirmDelete} className="text-[#7a6188] uppercase tracking-widest text-[10px] font-black hover:text-[#2d1f3d] transition-colors">
            Annuler Ops
          </Button>
          <Button onClick={handleConfirm} className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-[#2d1f3d] rounded-xl font-black uppercase tracking-widest px-8 transition-all">
            Confirmer Purge
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
