import { apiClient } from "../axiosInstance";

export const getTableLogs = async (pageIndex, pageSize, filters = {}) => {
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

    const response = await apiClient.get(`rep_table_logs`, {
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
