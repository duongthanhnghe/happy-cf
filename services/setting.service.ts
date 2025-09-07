// async function updateSettings(newData: any) {
//   const res = await fetch("/api/settings", {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(newData)
//   })
//   return await res.json()
// }
import { apiConfig } from '@/config/api.config'
import { API_ENDPOINTS } from '@/const/api.const'

export const settingAPI = {
  updateSettings: async (newData: any): Promise<any> => {
    try {
      const res = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.SETTINGS.UPDATE}`, {
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