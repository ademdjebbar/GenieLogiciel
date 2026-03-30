import { create } from 'zustand';

interface TaskToEdit {
  id?: string;
  title: string;
  description?: string;
  categoryId?: string;
  dueDate?: Date | null;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  subTasks?: string[];
  estimatedTime?: number;
}

interface ModalState {
  // Command Palette
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Task Modal
  isTaskModalOpen: boolean;
  taskToEdit: TaskToEdit | null;
  openTaskModal: (task?: TaskToEdit | null) => void;
  closeTaskModal: () => void;
  // Trigger fetch when task is created so lists refresh
  taskRefreshTrigger: number;
  triggerTaskRefresh: () => void;

  // Category Modal
  isCategoryModalOpen: boolean;
  openCategoryModal: () => void;
  closeCategoryModal: () => void;
  // Trigger fetch when cat is created
  categoryRefreshTrigger: number;
  triggerCategoryRefresh: () => void;

  // Confirm Delete
  isConfirmDeleteOpen: boolean;
  confirmDeleteAction: (() => void) | null;
  confirmDeleteTitle: string;
  confirmDeleteMessage: string;
  openConfirmDelete: (title: string, message: string, action: () => void) => void;
  closeConfirmDelete: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),

  isTaskModalOpen: false,
  taskToEdit: null,
  openTaskModal: (task = null) => set({ isTaskModalOpen: true, taskToEdit: task }),
  closeTaskModal: () => set({ isTaskModalOpen: false, taskToEdit: null }),
  taskRefreshTrigger: 0,
  triggerTaskRefresh: () => set((state) => ({ taskRefreshTrigger: state.taskRefreshTrigger + 1 })),

  isCategoryModalOpen: false,
  openCategoryModal: () => set({ isCategoryModalOpen: true }),
  closeCategoryModal: () => set({ isCategoryModalOpen: false }),
  categoryRefreshTrigger: 0,
  triggerCategoryRefresh: () => set((state) => ({ categoryRefreshTrigger: state.categoryRefreshTrigger + 1 })),

  isConfirmDeleteOpen: false,
  confirmDeleteAction: null,
  confirmDeleteTitle: '',
  confirmDeleteMessage: '',
  openConfirmDelete: (title, message, action) => 
    set({ isConfirmDeleteOpen: true, confirmDeleteTitle: title, confirmDeleteMessage: message, confirmDeleteAction: action }),
  closeConfirmDelete: () => set({ isConfirmDeleteOpen: false, confirmDeleteAction: null }),
}));
