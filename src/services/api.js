import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor: inject token ───────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("purrfocus_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor: handle 401 ────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("purrfocus_token");
      // Dispatch event agar AuthContext bisa react
      window.dispatchEvent(new CustomEvent("purrfocus-unauthorized"));
    }
    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/api/auth/register", data).then((r) => r.data),
  login: (data) => api.post("/api/auth/login", data).then((r) => r.data),
  me: () => api.get("/api/auth/me").then((r) => r.data),
};

// ─── Tasks ────────────────────────────────────────────────────────────────────
export const tasksAPI = {
  getAll: (archived = false) =>
    api.get(`/api/tasks?archived=${archived}`).then((r) => r.data),
  create: (data) => api.post("/api/tasks", data).then((r) => r.data),
  update: (id, data) => api.put(`/api/tasks/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/api/tasks/${id}`).then((r) => r.data),
  archive: (id) => api.patch(`/api/tasks/${id}/archive`).then((r) => r.data),

  addSubtask: (taskId, text) =>
    api.post(`/api/tasks/${taskId}/subtasks`, { text }).then((r) => r.data),
  updateSubtask: (taskId, subtaskId, data) =>
    api.put(`/api/tasks/${taskId}/subtasks/${subtaskId}`, data).then((r) => r.data),
  removeSubtask: (taskId, subtaskId) =>
    api.delete(`/api/tasks/${taskId}/subtasks/${subtaskId}`).then((r) => r.data),
};

// ─── Focus Logs ───────────────────────────────────────────────────────────────
export const focusLogsAPI = {
  getAll: () => api.get("/api/focus-logs").then((r) => r.data),
  create: (data) => api.post("/api/focus-logs", data).then((r) => r.data),
};

export default api;
