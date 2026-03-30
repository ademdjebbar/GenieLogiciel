import { useState, useEffect } from "react";
import { CheckSquare, Plus, Search } from "lucide-react";
import { useTaskStore } from "../store/taskStore";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Select";
import { Modal } from "../components/ui/Modal";
import { TaskCard } from "../components/tasks/TaskCard";
import { Skeleton } from "../components/ui/Skeleton";
import { useToast } from "../hooks/useToast";
import { TaskForm } from "../components/tasks/TaskForm";
import { ConfirmDeleteModal } from "../components/tasks/ConfirmDeleteModal";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(5px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 350, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, filter: "blur(5px)", transition: { duration: 0.2 } }
};

const Tasks = () => {
  const {
    tasks,
    loading,
    filters,
    fetchInitialData,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setFilters,
    setSearchQuery
  } = useTaskStore();

  const { showToast } = useToast();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== undefined) {
        fetchInitialData();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
        showToast("Tâche modifiée avec succès.");
      } else {
        await createTask(data);
        showToast("Tâche créée avec succès.");
      }
      setIsFormModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      showToast("Erreur d'enregistrement.", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete);
      showToast("Tâche supprimée.");
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      showToast("Erreur lors de la suppression.", "error");
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsFormModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setTaskToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ [filterName]: value });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-12"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-rose-50">
        <div>
          <h2 className="text-4xl font-extrabold text-text-primary tracking-tight mb-2">
            Vos Tâches
          </h2>
          <p className="text-text-secondary text-lg font-medium">
            Gérez votre charge de travail et vos priorités avec style.
          </p>
        </div>
        <Button
          onClick={() => { setEditingTask(null); setIsFormModalOpen(true); }}
          variant="primary"
          size="lg"
          className="w-full md:w-auto shadow-rose-glow"
        >
          <Plus size={20} className="mr-2" />
          Nouvelle Tâche
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-5">
        <div className="flex-1 relative group/search">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/search:text-primary transition-colors duration-300" size={24} />
          <input
            type="text"
            placeholder="Rechercher une tâche..."
            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-100 hover:border-accent/40 focus:border-primary focus:ring-4 focus:ring-accent/20 rounded-[1.5rem] text-lg font-medium text-text-primary outline-none transition-all duration-300 shadow-sm"
            value={filters.search}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <Select
            className="w-48 py-4 mx-0 shadow-sm border-gray-100 rounded-[1.5rem]"
            options={[
              { label: "Où en est-on ?", value: "" },
              { label: "En attente", value: "en_attente" },
              { label: "En cours", value: "en_cours" },
              { label: "Terminée", value: "termine" },
            ]}
            value={filters.statut}
            onChange={(e) => handleFilterChange('statut', e.target.value)}
          />
          <Select
            className="w-48 py-4 mx-0 shadow-sm border-gray-100 rounded-[1.5rem]"
            options={[
              { label: "Urgence", value: "" },
              { label: "Basse", value: "basse" },
              { label: "Moyenne", value: "moyenne" },
              { label: "Haute", value: "haute" },
              { label: "Critique", value: "critique" },
            ]}
            value={filters.priorite}
            onChange={(e) => handleFilterChange('priorite', e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {loading && tasks.length === 0 ? (
            Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-72 rounded-[2.5rem] bg-white border border-gray-100 shadow-soft" />)
          ) : tasks.length > 0 ? (
            tasks.map((task) => (
              <motion.div variants={itemVariants} key={task.id} layoutId={`task-${task.id}`} className="h-full">
                <TaskCard
                  task={task}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                  onStatusChange={updateTaskStatus}
                />
              </motion.div>
            ))
          ) : (
            <motion.div variants={itemVariants} className="col-span-full py-24 flex flex-col items-center justify-center text-center border-2 border-dashed border-rose-100 rounded-[2.5rem] bg-rose-50/50">
              <div className="w-20 h-20 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm flex items-center justify-center mb-6">
                <CheckSquare size={40} className="text-accent" />
              </div>
              <h4 className="text-2xl font-extrabold text-text-primary">Aucune tâche trouvée</h4>
              <p className="text-text-secondary text-lg font-medium mt-3 max-w-md leading-relaxed">Changez de filtres ou lancez-vous ! Créez votre première tâche pour donner le rythme à votre journée.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingTask ? "Modifier la Tâche" : "Créer une nouvelle Tâche"}
        maxWidth="xl"
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => setIsFormModalOpen(false)}
        />
      </Modal>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </motion.div>
  );
};

export { Tasks };
