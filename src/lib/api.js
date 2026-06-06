import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Inject JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nutriguide_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("nutriguide_token");
      localStorage.removeItem("nutriguide_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

// ── Auth ───────────────────────────────────────
export const authApi = {
  register: (data) => api.post("/auth/register", data).then((r) => r.data),
  login: (data) => api.post("/auth/login", data).then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
  refresh: () => api.post("/auth/refresh").then((r) => r.data),
  logout: () => api.post("/auth/logout").then((r) => r.data),
  providers: () => api.get("/auth/providers").then((r) => r.data),
};

// ── Profile ─────────────────────────────────────
export const profileApi = {
  get: () => api.get("/profile/me").then((r) => r.data),
  update: (data) => api.put("/profile/health", data).then((r) => r.data),
  conditions: () => api.get("/profile/conditions").then((r) => r.data),
};

// ── Recommendations ─────────────────────────────
export const recommendApi = {
  chat: (data) => api.post("/recommendations/chat", data).then((r) => r.data),
  compare: (data) => api.post("/recommendations/compare", data).then((r) => r.data),
  history: (params) => api.get("/recommendations/history", { params }).then((r) => r.data),
  clearHistory: () => api.delete("/recommendations/history").then((r) => r.data),
};

// ── Search ────────────────────────────────────────
export const searchApi = {
  foods: (params) => api.get("/search/foods", { params }).then((r) => r.data),
  cuisines: () => api.get("/search/cuisines").then((r) => r.data),
};

// ── Meal Plan ─────────────────────────────────────
export const mealPlanApi = {
  generate: (data) => api.post("/meal-plan/generate", data).then((r) => r.data),
  getCurrent: () => api.get("/meal-plan/current").then((r) => r.data),
  getDay: (dayName) => api.get(`/meal-plan/day/${dayName}`).then((r) => r.data),
  delete: () => api.delete("/meal-plan").then((r) => r.data),
};

// ── Analytics ─────────────────────────────────────
export const analyticsApi = {
  summary: () => api.get("/analytics/my-profile-summary").then((r) => r.data),
  conditionsGuide: () => api.get("/analytics/conditions-guide").then((r) => r.data),
};
