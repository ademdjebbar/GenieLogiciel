import { useState } from "react";
import { API_URL } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModalStore } from "@/store/useModalStore";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const COLORS = [
  "#ffafcc", // Emerald
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#ef4444", // Red
  "#f59e0b", // Amber
];

export function CategoryModal() {
  const { isCategoryModalOpen, closeCategoryModal, triggerCategoryRefresh } = useModalStore();
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, color: selectedColor }),
      });

      if (!res.ok) throw new Error("Erreur");
      
      toast.success("Espace de travail généré.");
      setName("");
      triggerCategoryRefresh();
      closeCategoryModal();
    } catch (err) {
      toast.error("Erreur d'initialisation de l'espace.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isCategoryModalOpen} onOpenChange={(open) => !open && closeCategoryModal()}>
      <DialogContent className="bg-white/90 backdrop-blur-xl border-[#cdb4db]/30 p-8 sm:rounded-[2rem] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-widest text-[#ffafcc] flex items-center gap-3">
            <Plus size={20} />
            Nouvel Espace
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 mt-4">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-[#7a6188] uppercase tracking-[0.2em]">Identifiant Ops</label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Marketing Digital"
              autoFocus
              className="bg-[#ffc8dd]/50 border-[#cdb4db]/20 h-14 rounded-2xl focus-visible:ring-[#ffafcc] text-[#2d1f3d] font-bold"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-[#7a6188] uppercase tracking-[0.2em]">Signature Visuelle</label>
            <div className="flex items-center gap-4">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedColor === c ? 'scale-125 border-2 border-white' : 'hover:scale-110 opacity-70'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4">
            <Button type="button" variant="ghost" onClick={closeCategoryModal} className="text-[#7a6188] uppercase tracking-widest text-[10px] font-black">
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !name.trim()} className="bg-[#ffafcc] text-[#2d1f3d] hover:bg-[#ffc8dd] rounded-xl font-black uppercase tracking-widest px-8">
              {loading ? "Génération..." : "Initialiser"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
