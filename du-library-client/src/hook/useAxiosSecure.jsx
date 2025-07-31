// src/hooks/axiosSecure.js
import axios from "axios";

export const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});
