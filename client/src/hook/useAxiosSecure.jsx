// src/hooks/axiosSecure.js
import axios from "axios";

export const axiosSecure = axios.create({
  baseURL: "http://localhost:3000", // use import.meta.env.VITE_API_BASE_URL in production
});
