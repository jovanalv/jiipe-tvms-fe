import { apiClient } from "../axiosInstance";

export const getAreas = async (pageIndex, pageSize, filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (pageIndex !== undefined && pageSize !== undefined) {
      params.set("page", String(pageIndex + 1));
      params.set("limit", String(pageSize));
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get("area/", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
      params,
    });

    return {
      data: response.data.data,
      totalRecords: response.data.totalRecords,
      totalPages:
        response.data.totalPage ||
        (pageSize ? Math.ceil(response.data.totalRecords / pageSize) : 1),
    };
  } catch (error) {
    console.error("Error fetching :", error);
    throw error?.response?.data;
  }
};

export const createArea = async (areaData) => {
  try {
    const response = await apiClient.post(`area`, [areaData], {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating area:", error);
    throw error?.response?.data;
  }
};

export const updateArea = async (id, updatedData) => {
  try {
    const response = await apiClient.put(`area/${id}`, updatedData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating area:", error);
    throw error?.response?.data;
  }
};
export const deleteArea = async (id, deletedData) => {
  try {
    const response = await apiClient.delete(`area/${id}`, deletedData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting area:", error);
    throw error?.response?.data;
  }
};
