import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS } from '@/services/const/api.const'

export const usersAPI = {
  getTopSearchKeyword: async (limit: number) => {
  try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.USERS.LIST_SEARCH_KEYWORD(limit)}`)
      const data = await response.json()
      return data;
    } catch (err) {
      console.error('Error:', err)
    }
  },
  logSearchKeyword: async (keyword: string) => {
    try {
      const res = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.USERS.LOG_SEARCH_KEYWORD}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      })

      const result = await res.json()
      return result
    } catch (err) {
      console.error('Error logging search keyword:', err)
    }
  },
}