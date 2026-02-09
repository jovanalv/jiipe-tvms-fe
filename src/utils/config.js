export function getApiBaseUrl() {
  if (import.meta.env.DEV) {
    return `${import.meta.env.VITE_API_BASE_URL}`;
  }

  if (import.meta.env.VITE_API_USE_ENV === "true") {
    return import.meta.env.VITE_API_BASE_URL;
  }

  return window.runtimeConfig?.apiBaseUrl || `${window.location.origin}/api/`;
}

export function getAppEnv() {
  return window.runtimeConfig?.appEnv || "development";
}
