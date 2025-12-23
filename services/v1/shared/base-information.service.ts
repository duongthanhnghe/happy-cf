import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS_SHARED } from '@/services/const/api.endpoints-shared'
import { fetchWithAuthAdmin } from '@/services/helpers/fetchWithAuthAdmin';

export const baseInformationAPI = {
  getBaseInformation: async (): Promise<any> => {
    try {
      const res = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS_SHARED.BASE_INFORMATION.GET}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
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

  updateBaseInformation: async (newData: any): Promise<any> => {
    try {
      const res = await fetchWithAuthAdmin(`${apiConfig.baseApiURL}${API_ENDPOINTS_SHARED.BASE_INFORMATION.UPDATE}`, {
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
