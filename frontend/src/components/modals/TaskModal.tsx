import { useState, useEffect } from "react";
import { API_URL } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModalStore } from "@/store/useModalStore";
import { toast } from "sonner";
import { Zap, Calendar as CalendarIcon, Hash, AlignLeft, Clock, Flag, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function TaskModal() {
  const { isTaskModalOpen, closeTaskModal, taskToEdit, triggerTaskRefresh, categoryRefreshTrigger } = useModalStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [subTasks, setSubTasks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (isTaskModalOpen) {
      fetchCategories();
      if (taskToEdit) {
        setTitle(taskToEdit.title || "");
        setDescription(taskToEdit.description || "");
        setCategoryId(taskToEdit.categoryId || "");
        setPriority(taskToEdit.priority || "MEDIUM");
        setEstimatedTime(taskToEdit.estimatedTime ? taskToEdit.estimatedTime.toString() : "");
        setSubTasks([]);
        if (taskToEdit.dueDate) {
          try {
            setDueDate(format(new Date(taskToEdit.dueDate), 'yyyy-MM-dd'));
          } catch(e) {}
        }
      } else {
        resetForm();
      }
    }
  }, [isTaskModalOpen, taskToEdit, categoryRefreshTrigger]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategoryId("");
    setPriority("MEDIUM");
    setDueDate("");
    setEstimatedTime("");
    setSubTasks([]);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if(res.ok) setCategories(await res.json());
    } catch (err) {}
  };

  const addSubTask = () => setSubTasks([...subTasks, ""]);
  const updateSubTask = (idx: number, val: string) => {
    const arr = [...subTasks];
    arr[idx] = val;
    setSubTasks(arr);
  };
  const removeSubTask = (idx: number) => {
    setSubTasks(subTasks.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const payload: any = { title, priority };
      if (description) payload.description = description;
      if (categoryId) payload.categoryId = categoryId;
      if (dueDate) payload.dueDate = new Date(dueDate).toISOString();
      if (estimatedTime) payload.estimatedTime = parseInt(estimatedTime, 10);

      const validSubTasks = subTasks.filter(s => s.trim().length > 0);
      if (validSubTasks.length > 0 && !taskToEdit?.id) {
         payload.subTasks = validSubTasks;
      }

      const isEditing = !!taskToEdit?.id;
      const url = isEditing
        ? `${API_URL}/api/tasks/${taskToEdit.id}`
        : `${API_URL}/api/tasks`;
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erreur");

      toast.success(isEditing ? "Tâche mise à jour." : "Tâche créée avec succès.");
      triggerTaskRefresh();
      closeTaskModal();
    } catch (err) {
      toast.error(taskToEdit?.id ? "Échec de la mise à jour." : "Échec de la création.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isTaskModalOpen} onOpenChange={(open) => !open && closeTaskModal()}>
      <DialogContent className="bg-white/95 backdrop-blur-xl border-[#cdb4db]/30 p-0 sm:rounded-2xl max-w-3xl max-h-[90vh] overflow-hidden flex flex-col selection:bg-[#ffafcc]/30">

        <DialogHeader className="p-6 pb-4 shrink-0 border-b border-[#cdb4db]/15">
          <DialogTitle className="text-lg font-extrabold text-[#2d1f3d] flex items-center gap-2">
            <Zap size={18} className="text-[#ffafcc]" />
            {taskToEdit?.id ? "Modifier la tâche" : "Nouvelle tâche"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

            {/* Titre */}
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la tâche..."
              autoFocus
              className="bg-transparent border-0 h-14 text-xl font-extrabold placeholder:text-[#cdb4db] text-[#2d1f3d] focus-visible:ring-0 px-0 shadow-none border-b border-b-[#cdb4db]/15"
            />

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-[#7a6188] uppercase tracking-wider flex items-center gap-1.5">
                <AlignLeft size={11} className="text-[#cdb4db]" /> Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Détails optionnels..."
                className="w-full bg-[#cdb4db]/8 border border-[#cdb4db]/15 h-20 rounded-xl text-[#2d1f3d] font-medium p-3 text-sm focus:ring-1 focus:ring-[#ffafcc] focus:outline-none resize-none placeholder:text-[#cdb4db]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Priorité */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-[#7a6188] uppercase tracking-wider flex items-center gap-1.5">
                  <Flag size={11} className="text-[#cdb4db]" /> Priorité
                </label>
                <div className="flex gap-2">
                  {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p as any)}
                      className={cn(
                        "px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all border",
                        priority === p
                          ? "bg-[#ffafcc]/15 border-[#ffafcc]/40 text-[#ffafcc]"
                          : "bg-[#cdb4db]/8 border-[#cdb4db]/15 text-[#7a6188] hover:bg-[#cdb4db]/15"
                      )}
                    >
                      {p === 'LOW' ? 'Basse' : p === 'MEDIUM' ? 'Moyenne' : p === 'HIGH' ? 'Haute' : 'Critique'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Catégorie */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-[#7a6188] uppercase tracking-wider flex items-center gap-1.5">
                  <Hash size={11} className="text-[#cdb4db]" /> Catégorie
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-[#cdb4db]/8 border border-[#cdb4db]/15 h-10 rounded-lg text-[#2d1f3d] font-semibold p-2 text-xs focus:ring-1 focus:ring-[#ffafcc] focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">Non classé</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-[#7a6188] uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarIcon size={11} className="text-[#cdb4db]" /> Deadline
                </label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-[#cdb4db]/8 border-[#cdb4db]/15 h-10 rounded-lg text-[#2d1f3d] font-semibold text-xs focus-visible:ring-1 focus-visible:ring-[#ffafcc]"
                />
              </div>

              {/* Temps estimé */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-[#7a6188] uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={11} className="text-[#cdb4db]" /> Temps estimé (min)
                </label>
                <Input
                  type="number"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  placeholder="Ex: 60"
                  className="bg-[#cdb4db]/8 border-[#cdb4db]/15 h-10 rounded-lg text-[#2d1f3d] font-semibold text-xs focus-visible:ring-1 focus-visible:ring-[#ffafcc] placeholder:text-[#cdb4db]"
                />
              </div>
            </div>

            {/* Sous-tâches (Création uniquement) */}
            {!taskToEdit && (
              <div className="space-y-3 pt-4 border-t border-[#cdb4db]/15">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-semibold text-[#7a6188] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 size={11} className="text-[#cdb4db]" /> Sous-tâches
                  </label>
                  <Button type="button" variant="ghost" onClick={addSubTask} className="h-7 text-[10px] font-bold text-[#ffafcc] hover:bg-[#ffafcc]/10 px-2">
                    <Plus size={12} className="mr-1" /> Ajouter
                  </Button>
                </div>

                <div className="space-y-2">
                  {subTasks.map((sub, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={sub}
                        onChange={e => updateSubTask(idx, e.target.value)}
                        placeholder="Sous-tâche..."
                        className="flex-1 bg-white border-[#cdb4db]/20 h-9 rounded-lg text-xs font-semibold text-[#2d1f3d] focus-visible:ring-1 focus-visible:ring-[#ffafcc] placeholder:text-[#cdb4db]"
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeSubTask(idx)} className="h-9 w-9 text-[#7a6188] hover:text-[#e8566d] hover:bg-[#e8566d]/10 rounded-lg">
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  ))}
                  {subTasks.length === 0 && (
                    <p className="text-[10px] text-[#cdb4db] py-1">Aucune sous-tâche.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer avec boutons DANS le form */}
          <div className="p-6 pt-4 border-t border-[#cdb4db]/15 shrink-0 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={closeTaskModal} className="text-[#7a6188] text-xs font-semibold hover:text-[#2d1f3d] px-4">
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !title.trim()} className="bg-gradient-to-r from-[#ffafcc] to-[#ffc8dd] text-[#2d1f3d] hover:from-[#ffc8dd] hover:to-[#ffafcc] rounded-xl font-bold text-xs px-8 h-10 shadow-lg shadow-[#ffafcc]/15 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40">
              {loading ? "En cours..." : taskToEdit?.id ? "Mettre à jour" : "Créer la tâche"}
            </Button>
          </div>
        </form>

      </DialogContent>
    </Dialog>
  );
}
