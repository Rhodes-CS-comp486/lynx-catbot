import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});


api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error);
  }
)

export default api;

