import { apiClient, apiClientRaw } from "../axiosInstance";

export const getUploadApp = async () => {
  try {
    const response = await apiClient.get("upload-app", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const updateApp = async (payload) => {
  try {
    const response = await apiClientRaw.post(`upload-app`, payload, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating area:", error);
    throw error?.response?.data;
  }
};

export const downloadApp = async () => {
  try {
    const response = await apiClientRaw.get("upload-app/download", {
      responseType: "blob",
      withCredentials: true,
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "app.apk");
    document.body.appendChild(link);
    link.click();
    link.remove();

    return true;
  } catch (error) {
    console.error("Error downloading app:", error);
    throw error?.response?.data;
  }
};
