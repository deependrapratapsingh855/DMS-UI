import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://dms-backend-n9uw.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Send email + password to backend.
 * Backend handles encryption check and returns 200 on success.
 */
export const loginUser = async (email, password) => {
  const response = await api.post("/api/users/login", {
  "username": email,
  "password": password
});
  return response.data; // e.g. { success: true, user: { name, email } }
};

/** Mark user as logged in (simple flag + optional user data) */
export const saveSession = (user = {}) => {
  localStorage.setItem("dms_logged_in", "true");
  if (user) localStorage.setItem("dms_user", JSON.stringify(user));
};

/** Check if session exists */
export const isLoggedIn = () => localStorage.getItem("dms_logged_in") === "true";

/** Clear session on logout */
export const clearSession = () => {
  localStorage.removeItem("dms_logged_in");
  localStorage.removeItem("dms_user");
};

export const registerUser = (payload) =>
  axios.post("/api/users/create", payload).then(r => r.data);