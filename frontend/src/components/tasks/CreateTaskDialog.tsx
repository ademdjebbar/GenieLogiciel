import React, { useState, useEffect } from 'react';
import { API_URL } from '@/lib/api';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, X, Sparkles, ListTodo, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated: () => void;
}

export function CreateTaskDialog({ open, onOpenChange, onTaskCreated }: CreateTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [subTasks, setSubTasks] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addSubTask = () => setSubTasks([...subTasks, '']);
  const removeSubTask = (index: number) => setSubTasks(subTasks.filter((_, i) => i !== index));
  const updateSubTask = (index: number, val: string) => {
    const newSubTasks = [...subTasks];
    newSubTasks[index] = val;
    setSubTasks(newSubTasks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          categoryId,
          dueDate: dueDate || undefined,
          subTasks: subTasks.filter(s => s.trim() !== '')
        })
      });

      if (res.ok) {
        toast.success("Tâche créée avec succès !");
        onTaskCreated();
        onOpenChange(false);
        resetForm();
      } else {
        const err = await res.json();
        toast.error(err.error || "Erreur lors de la création");
      }
    } catch (err) {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setCategoryId(null);
    setDueDate('');
    setSubTasks([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-[#cdb4db]/20 sm:max-w-[550px] p-0 overflow-hidden rounded-3xl">
        
        {/* Barre de décor Aurora style v2 */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#ffafcc] via-purple-500 to-[#ffafcc] opacity-50" />
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-[#2d1f3d] tracking-tighter flex items-center gap-3">
               Nouvelle Tâche 
               <Sparkles className="text-[#ffafcc] w-5 h-5 animate-pulse" />
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-[#7a6188] uppercase tracking-widest px-1">Concept</Label>
              <Input
                placeholder="Qu'avez-vous en tête ?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-[#ffc8dd]/10 border-[#cdb4db]/20 h-12 focus-visible:ring-[#ffafcc] rounded-xl font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-[#7a6188] uppercase tracking-widest px-1">Échéance</Label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="bg-[#ffc8dd]/10 border-[#cdb4db]/20 h-12 text-[#7a6188] focus-visible:ring-[#ffafcc] rounded-xl"
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a6188] pointer-events-none" size={16} />
                  </div>
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-[#7a6188] uppercase tracking-widest px-1">Priorité</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="bg-[#ffc8dd]/10 border-[#cdb4db]/20 h-12 text-[#7a6188] rounded-xl focus:ring-0">
                      <SelectValue placeholder="Priorité" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#ffc8dd]/10 border-[#cdb4db]/30 text-[#2d1f3d] rounded-xl">
                      <SelectItem value="LOW">Basse</SelectItem>
                      <SelectItem value="MEDIUM">Moyenne</SelectItem>
                      <SelectItem value="HIGH">Haute</SelectItem>
                      <SelectItem value="CRITICAL">Critique</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-[#7a6188] uppercase tracking-widest px-1">Espace / Catégorie</Label>
              <Select value={categoryId || ''} onValueChange={setCategoryId}>
                <SelectTrigger className="bg-[#ffc8dd]/10 border-[#cdb4db]/20 h-12 text-[#7a6188] rounded-xl">
                  <SelectValue placeholder="Séléctionner un espace" />
                </SelectTrigger>
                <SelectContent className="bg-[#ffc8dd]/10 border-[#cdb4db]/30 text-[#2d1f3d] rounded-xl">
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                       <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                          {c.name}
                       </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Section Sous-tâches (SubTasks) UI Final Polish */}
            <div className="space-y-3">
               <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-black text-[#7a6188] uppercase tracking-widest px-1 flex items-center gap-2">
                    <ListTodo size={12} /> Décomposer le Travail
                  </Label>
                  <button 
                    type="button" 
                    onClick={addSubTask}
                    className="text-[10px] bg-[#cdb4db]/8 hover:bg-[#cdb4db]/15 text-[#ffc8dd] font-black px-2 py-1 rounded-md border border-[#cdb4db]/20 uppercase transition-all"
                  >
                    + AJOUTER ÉTAPE
                  </button>
               </div>
               
               <div className="space-y-2 max-h-[140px] overflow-y-auto pr-2 scrollbar-hide">
                  <AnimatePresence>
                     {subTasks.map((st, i) => (
                       <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: 10 }}
                        key={i} 
                        className="flex gap-2"
                       >
                         <Input
                           placeholder={`Étape ${i+1}...`}
                           value={st}
                           onChange={(e) => updateSubTask(i, e.target.value)}
                           className="bg-[#ffc8dd]/50 border-[#cdb4db]/20 h-10 text-xs rounded-xl flex-1"
                         />
                         <Button 
                           type="button" 
                           variant="ghost" 
                           onClick={() => removeSubTask(i)}
                           className="h-10 w-10 p-0 text-[#7a6188] hover:text-red-400"
                         >
                           <X size={14} />
                         </Button>
                       </motion.div>
                     ))}
                  </AnimatePresence>
                  {subTasks.length === 0 && (
                    <div className="py-4 border border-dashed border-[#cdb4db]/20 rounded-xl flex items-center justify-center">
                       <span className="text-[10px] text-[#9b85a8] font-bold uppercase tracking-widest italic">Aucune étape définie</span>
                    </div>
                  )}
               </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-[#7a6188] uppercase tracking-widest px-1">Détails Additionnels (Rich Text)</Label>
              <Textarea
                placeholder="Notes IA et détails..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-[#ffc8dd]/10 border-[#cdb4db]/20 min-h-[100px] text-[#7a6188] rounded-xl resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-3 sm:justify-end">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="px-8 font-bold text-[#7a6188] hover:text-[#2d1f3d] rounded-xl"
            >
              ANNULER
            </Button>
            <Button 
              disabled={isLoading || !title.trim()} 
              className="bg-white text-[#2d1f3d] hover:bg-[#ffc8dd]/30 px-10 font-bold rounded-xl shadow-2xl transition-all active:scale-95"
            >
              {isLoading ? "CALCUL IA..." : "CRÉER LA TÂCHE"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
