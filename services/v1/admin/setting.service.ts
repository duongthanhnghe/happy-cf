import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin'

export const settingAPI = {
  updateSettings: async (newData: any): Promise<any> => {
    try {
      const res = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.SETTINGS.UPDATE}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      const result = await res.json();

      return result;
    } catch (err) {
      console.error("Error:", err);
      return {
        code: 1,
        message: "Failed to fetch",
        data: [],
      };
    }
  },
}