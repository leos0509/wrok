import axios from "axios";
import { getToken } from "./utils";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken() || ""}`,
  },
  withCredentials: true,
});
