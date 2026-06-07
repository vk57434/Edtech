const defaultUrl = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://edtech-kpvy.onrender.com/api";

export const API_URL = import.meta.env.VITE_API_URL || defaultUrl;
