import axios from "axios";
import supabase from "../auth/supabaseClient";
import { handleApiError } from "../utils/errorHandler";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers["Authorization"] = `Bearer ${session.access_token}`;
  }
  return config;
}, handleApiError);

apiClient.interceptors.response.use((response) => response, handleApiError);

export default apiClient;
