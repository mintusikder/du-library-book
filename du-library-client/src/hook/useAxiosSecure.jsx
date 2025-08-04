// src/hooks/axiosSecure.js
import axios from "axios";

export const axiosSecure = axios.create({
  baseURL: "https://du-library-server.vercel.app",
});
