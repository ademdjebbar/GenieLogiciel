import { create } from 'zustand';
import { 
  getTasks, 
  getOverdue,
  createTask as apiCreateTask, 
  updateTask as apiUpdateTask, 
  deleteTask as apiDeleteTask,
  updateTaskStatus as apiUpdateTaskStatus
} from '../services/api';

// Helper pour ne pas envoyer les filtres vides
const cleanFilters = (filters) => {
  return Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== "")
  );
};

export const useTaskStore = create((set, get) => ({
  // --- STATE ---
  tasks: [],
  overdueTasks: [],
  loading: true,
  filters: {
    statut: "",
    priorite: "",
    categorie: "",
    search: "",
  },

  // --- ACTIONS ---

  // Action pour récupérer toutes les données initiales
  fetchInitialData: async () => {
    set({ loading: true });
    try {
      const cleaned = cleanFilters(get().filters);
      const [tasksRes, overdueRes] = await Promise.all([
        getTasks(cleaned),
        getOverdue()
      ]);
      set({
        tasks: tasksRes.data,
        overdueTasks: overdueRes.data,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
      set({ loading: false });
    }
  },

  // Action pour créer une tâche
  createTask: async (taskData) => {
    await apiCreateTask(taskData);
    // Re-fetch pour s'assurer que tout est à jour
    await get().fetchInitialData();
  },

  // Action pour mettre à jour une tâche
  updateTask: async (taskId, taskData) => {
    await apiUpdateTask(taskId, taskData);
    await get().fetchInitialData();
  },

  // Action pour supprimer une tâche
  deleteTask: async (taskId) => {
    await apiDeleteTask(taskId);
    await get().fetchInitialData();
  },

  // Action pour changer le statut
  updateTaskStatus: async (taskId, status) => {
    await apiUpdateTaskStatus(taskId, status);
    await get().fetchInitialData();
  },

  // Action pour mettre à jour les filtres
  setFilters: (newFilters) => {
    set({ filters: { ...get().filters, ...newFilters } });
    // Re-fetch les tâches avec les nouveaux filtres
    get().fetchInitialData();
  },
  
  // Action pour une recherche (avec debounce implicite dans la page)
  setSearchQuery: (query) => {
    set({ filters: { ...get().filters, search: query } });
    get().fetchInitialData();
  }
}));
