import { Calendar, Clock, Edit2, Trash2, CheckCircle, PlayCircle, PauseCircle } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/Card";
import { cn } from "../../utils/cn";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const priorityVariants = {
    basse: "default",
    moyenne: "warning",
    haute: "danger",
    critique: "danger",
  };

  const statusLabels = {
    en_attente: "En attente",
    en_cours: "En cours",
    termine: "Terminée",
  };

  const getProgress = () => {
    if (task.statut === "termine") return 100;
    if (task.statut === "en_cours") return 50;
    return 0;
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col group overflow-hidden relative cursor-default">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent rounded-[2rem] pointer-events-none z-0"></div>
        <CardHeader className="flex-none pb-0 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <Badge variant={priorityVariants[task.priorite]}>
                {task.priorite.toUpperCase()}
              </Badge>
              <span className="text-text-secondary text-xs font-bold uppercase tracking-wider bg-rose-50 px-3 py-1.5 rounded-[1.2rem]">{task.categorie}</span>
            </div>

            <div className="flex items-center gap-1 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(task)}
                className="p-2.5 rounded-[1rem] hover:bg-rose-50 text-text-secondary hover:text-primary transition-colors focus:outline-none"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-2.5 rounded-[1rem] hover:bg-rose-50 text-text-secondary hover:text-danger transition-colors focus:outline-none"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <CardTitle className="mb-2">{task.titre}</CardTitle>
          <CardDescription className="mb-4">
            {task.description || "Aucune description fournie."}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-end mt-4 relative z-10 pb-0">
          <div className="flex items-center justify-between text-sm font-bold text-text-secondary bg-rose-50/70 p-4 rounded-[1.5rem] shadow-sm w-full mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-primary/70" />
              <span>{format(new Date(task.date_echeance), "d MMM yyyy", { locale: fr })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-primary/70" />
              <span>{task.duree_estimee} min</span>
            </div>
          </div>

          <div className="space-y-3 px-1 w-full">
            <div className="flex justify-between text-base font-extrabold">
              <span className="text-text-secondary">{statusLabels[task.statut]}</span>
              <span className="text-primary">{getProgress()}%</span>
            </div>
            <div className="w-full h-2.5 bg-rose-50 rounded-full overflow-hidden border border-rose-100/50">
              <div
                className={cn(
                  "h-full transition-all duration-700 ease-out rounded-full shadow-sm",
                  task.statut === "termine" ? "bg-emerald-400" : "bg-gradient-to-r from-accent to-primary"
                )}
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-none pt-6 mt-4 border-t border-rose-50 relative z-10">
          {task.statut !== "termine" && (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => onStatusChange(task.id, task.statut === "en_cours" ? "termine" : "en_cours")}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] bg-gradient-to-tr from-accent to-primary hover:from-primary hover:to-primary-dark text-white text-base font-extrabold transition-all duration-300 shadow-soft hover:shadow-rose-glow"
            >
              {task.statut === "en_cours" ? (
                <>
                  <CheckCircle size={20} />
                  <span>Terminer</span>
                </>
              ) : (
                <>
                  <PlayCircle size={20} />
                  <span>Démarrer</span>
                </>
              )}
            </motion.button>
          )}
          {task.statut === "termine" && (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => onStatusChange(task.id, "en_attente")}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] bg-white border-2 border-gray-100 hover:border-accent/40 text-text-secondary hover:text-primary text-base font-extrabold transition-all duration-300 shadow-sm"
            >
              <PauseCircle size={20} />
              <span>Réouvrir la Tâche</span>
            </motion.button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export { TaskCard };
