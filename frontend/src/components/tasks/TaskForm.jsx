import { useState, useEffect } from "react";
import { 
  Trophy, 
  Plus, 
  Calendar, 
  Tag, 
  Zap, 
  Clock, 
  FileText,
  Save,
  X
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    categorie: "autre",
    priorite: "moyenne",
    date_echeance: new Date().toISOString().split("T")[0],
    duree_estimee: 30,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        titre: task.titre,
        description: task.description || "",
        categorie: task.categorie,
        priorite: task.priorite,
        date_echeance: task.date_echeance.split("T")[0],
        duree_estimee: task.duree_estimee,
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Titre de la tâche"
            placeholder="Ex: Réviser le chapitre 3"
            required
            icon={Zap}
            value={formData.titre}
            onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
            className="text-lg font-bold h-12"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-text-primary dark:text-text-light/80 mb-1.5 flex items-center gap-2">
            <FileText size={16} className="text-gray-400" />
            Description
          </label>
          <textarea
            className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200 text-text-primary dark:text-text-light placeholder:text-gray-400 min-h-[100px] resize-none"
            placeholder="Ajouter des détails..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <Select
          label="Catégorie"
          icon={Tag}
          options={[
            { label: "Travail 💼", value: "travail" },
            { label: "Personnel 👤", value: "personnel" },
            { label: "Études 📚", value: "etudes" },
            { label: "Autre 📁", value: "autre" },
          ]}
          value={formData.categorie}
          onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
        />

        <Select
          label="Priorité"
          icon={Trophy}
          options={[
            { label: "Basse 🟢", value: "basse" },
            { label: "Moyenne 🟡", value: "moyenne" },
            { label: "Haute 🔴", value: "haute" },
            { label: "Critique 🟣", value: "critique" },
          ]}
          value={formData.priorite}
          onChange={(e) => setFormData({ ...formData, priorite: e.target.value })}
        />

        <Input
          label="Date d'échéance"
          type="date"
          icon={Calendar}
          required
          value={formData.date_echeance}
          onChange={(e) => setFormData({ ...formData, date_echeance: e.target.value })}
        />

        <Input
          label="Durée estimée (min)"
          type="number"
          icon={Clock}
          required
          min="1"
          value={formData.duree_estimee}
          onChange={(e) => setFormData({ ...formData, duree_estimee: parseInt(e.target.value) })}
        />
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Button 
          type="button" 
          variant="ghost" 
          className="flex-1" 
          onClick={onCancel}
        >
          <X className="mr-2" size={18} />
          Annuler
        </Button>
        <Button 
          type="submit" 
          className="flex-[2] h-12 shadow-premium shadow-accent/20"
        >
          <Save className="mr-2" size={20} />
          {task ? "Enregistrer les modifications" : "Créer la tâche"}
        </Button>
      </div>
    </form>
  );
};

export { TaskForm };
