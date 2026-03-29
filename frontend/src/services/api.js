import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Using a simple alert for now. In a real app, you might use a toast notification
      // or a more sophisticated global error handling mechanism.
      alert("Session expirée. Veuillez vous reconnecter.");
      localStorage.removeItem("token");
      // Use window.location to force a full page refresh, which will also clear any in-memory state.
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


// Tasks
export const getTasks = (params) => api.get("/tasks/", { params });
export const createTask = (data) => api.post("/tasks/", data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const updateTaskStatus = (id, statut) =>
  api.patch(`/tasks/${id}/status`, { statut });

// IA
export const getPrioritize = () => api.get("/ai/prioritize");
export const getSuggestions = () => api.get("/ai/suggestions");
export const getAnalyze = () => api.get("/ai/analyze");

// Notifications
export const getOverdue = () => api.get("/notifications/overdue");
export const getDailySummary = () => api.get("/notifications/daily-summary");

// Preferences
export const getPreferences = () => api.get("/preferences/");
export const updatePreferences = (data) => api.put("/preferences/", data);

export default api;
