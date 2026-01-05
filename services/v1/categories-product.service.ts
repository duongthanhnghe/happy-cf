import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS } from '@/services/const/api.const'

export const categoriesAPI = {
  getAll: async () => {
  try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES.LIST}`)
      const data = await response.json()
      return data;
    } catch (err) {
      console.error('Error:', err)
    }
  },
  getAllTree: async () => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES.LIST_TREE}`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error:', err);
    }
  },
  // getChildren: async (parentId: string, includeInactive = false) => {
  //   try {
  //     const url = new URL(`${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES.GET_CHILDREN(parentId)}`)
  //     url.searchParams.set("includeInactive", String(includeInactive))

  //     const response = await fetch(url.toString())
  //     return await response.json()
  //   } catch (err) {
  //     console.error(err)
  //     throw err
  //   }
  // },
  getChildren: async (parentId: string, includeInactive = false) => {
    try {
      const params = new URLSearchParams({
        includeInactive: String(includeInactive),
      })

      const res = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES.GET_CHILDREN(parentId)}?${params.toString()}`
      )

      return await res.json()
    } catch (err) {
      console.error("Error fetching child categories:", err)
      throw err
    }
  },
  getDetail: async (id: string) => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES.GET_BY_ID(id)}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch category with ID ${id}`)
      }
      const data = await response.json()
      return data
    } catch (err) {
      console.error(`Error getting category detail with ID ${id}:`, err)
      throw err
    }
  },
  getDetailBySlug: async (slug: string) => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES.GET_BY_SLUG(slug)}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch category with slug ${slug}`)
      }
      const data = await response.json()
      return data
    } catch (err) {
      console.error(`Error getting category detail with slug ${slug}:`, err)
      throw err
    }
  },
}