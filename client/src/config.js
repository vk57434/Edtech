const defaultBaseUrl = import.meta.env.DEV
  ? "http://localhost:5000"
  : "https://edtech-1-qzwo.onrender.com";

const baseUrl = (import.meta.env.VITE_API_URL || defaultBaseUrl)
  .replace(/\/+$/, "")
  .replace(/\/api$/i, "");

export const API_URL = `${baseUrl}/api`;
