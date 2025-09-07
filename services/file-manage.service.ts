import { apiConfig } from '@/config/api.config'
import { API_ENDPOINTS } from '@/const/api.const'

export const fileManageAPI = {
  getImages: async (folder: string, max_results: number = 10, next_cursor?: string) => {
    try {
      let url = `${apiConfig.baseApiURL}${API_ENDPOINTS.FILE_MANAGE.GET_IMAGES(folder, max_results)}`
      if (next_cursor) {
        url += `&next_cursor=${next_cursor}`
      }

      const response = await fetch(url)
      const data = await response.json()
      return data
    } catch (err) {
      console.error('Error:', err)
    }
  },

  getFolders: async () => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.FILE_MANAGE.GET_FOLDERS()}`)
      const data = await response.json()
      return data
    } catch (err) {
      console.error('Error:', err)
    }
  },

  deleteImage: async (publicId: string) => {
    try {
      const encodedId = encodeURIComponent(publicId)
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.FILE_MANAGE.DELETE_IMAGE(encodedId)}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      return data
    } catch (err) {
      console.error('Error:', err)
    }
  },

  searchImage: async (url: string, folder?: string) => {
    try {
      const params = new URLSearchParams()
      params.append('url', url)
      if (folder) params.append('folder', folder)

      const response = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.FILE_MANAGE.SEARCH_IMAGE()}?${params.toString()}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error('Error in searchImage:', err)
      return { success: false, message: String(err) }
    }
  },

  uploadImage: async (file: File, folder: string) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.FILE_MANAGE.UPLOAD}`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      return data
    } catch (err) {
      console.error('Upload image error:', err)
      return { success: false, message: 'Upload failed' }
    }
  },

  uploadAvatar: async (file: File, folder: string, userId: string) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      formData.append('userId', userId);

      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.FILE_MANAGE.UPLOAD}`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      return data
    } catch (err) {
      console.error('Upload image error:', err)
      return { success: false, message: 'Upload failed' }
    }
  }

}