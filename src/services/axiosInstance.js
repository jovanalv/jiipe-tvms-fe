import axios from "axios";
import { getApiBaseUrl } from "../utils/config";

const API_URL = getApiBaseUrl();

// Axios Instance for Protected Api
const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.warn("Unauthorized! Redirecting to login...");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else if (status === 403) {
        console.warn("Forbidden! Redirecting to access denied page...");
        window.location.href = "/FORBIDDEN";
      }
    }
    return Promise.reject(error);
  }
);

// Axios Instance for Protected Api Multipart FormData
const apiClientRaw = axios.create({
  baseURL: API_URL,
});

apiClientRaw.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClientRaw.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.warn("Unauthorized! Redirecting to login...");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else if (status === 403) {
        console.warn("Forbidden! Redirecting to access denied page...");
        window.location.href = "/FORBIDDEN";
      }
    }
    return Promise.reject(error);
  }
);

// Axios Instance for Public Api
const apiPublic = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiPublic.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export { apiClient, apiPublic, apiClientRaw };
