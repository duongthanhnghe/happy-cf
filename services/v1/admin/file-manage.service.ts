import { apiAdmin } from '@/services/http/apiAdmin'
import { API_ENDPOINTS_SHARED } from '@/services/const/api.endpoints-shared'

export const fileManageAPI = {
  getImages: async (
    folder: string, 
    max_results: number = 10, 
    next_cursor?: string
  ): Promise<any> => {
    try {
      const params = new URLSearchParams({ max_results: max_results.toString() })
      if (next_cursor) params.append('next_cursor', next_cursor)

      return await apiAdmin().get(
        `${API_ENDPOINTS_SHARED.FILE_MANAGE.GET_IMAGES(folder, max_results)}?${params.toString()}`
      )
    } catch (err: any) {
      console.error('Error fetching images:', err)
      return { success: false, message: err.message }
    }
  },

  getFolders: async (): Promise<any> => {
    try {
      return await apiAdmin().get(API_ENDPOINTS_SHARED.FILE_MANAGE.GET_FOLDERS())
    } catch (err: any) {
      console.error('Error fetching folders:', err)
      return { success: false, message: err.message }
    }
  },

  deleteImage: async (publicId: string): Promise<any> => {
    try {
      const encodedId = encodeURIComponent(publicId)
      return await apiAdmin().delete(API_ENDPOINTS_SHARED.FILE_MANAGE.DELETE_IMAGE(encodedId))
    } catch (err: any) {
      console.error('Error deleting image:', err)
      return { success: false, message: err.message }
    }
  },

  deleteImages: async (publicIds: string[]): Promise<any> => {
    try {
      return await apiAdmin().post(API_ENDPOINTS_SHARED.FILE_MANAGE.DELETE_IMAGES, { publicIds })
    } catch (err: any) {
      console.error('Error deleting multiple images:', err)
      return { success: false, message: err.message }
    }
  },

  searchImage: async (url: string, folder?: string): Promise<any> => {
    try {
      const params: Record<string, string> = { url }
      if (folder) params.folder = folder

      const query = new URLSearchParams(params).toString()
      return await apiAdmin().get(`${API_ENDPOINTS_SHARED.FILE_MANAGE.SEARCH_IMAGE()}?${query}`)
    } catch (err: any) {
      console.error('Error searching image:', err)
      return { success: false, message: err.message }
    }
  },

  uploadImage: async (files: File[], folder: string): Promise<any> => {
    try {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      formData.append('folder', folder)

      return await apiAdmin().post(API_ENDPOINTS_SHARED.FILE_MANAGE.UPLOAD, formData)
    } catch (err: any) {
      console.error('Error uploading images:', err)
      return { success: false, message: 'Upload failed' }
    }
  },
}

// import { API_ENDPOINTS_SHARED } from '@/services/const/api.endpoints-shared'
// import { fetchWithAuthAdmin } from '@/services/helpers/fetchWithAuthAdmin'

// export const fileManageAPI = {
//   getImages: async (folder: string, max_results: number = 10, next_cursor?: string) => {
//     try {
//       let url = `${apiConfig.baseApiURL}${API_ENDPOINTS_SHARED.FILE_MANAGE.GET_IMAGES(folder, max_results)}`
//       if (next_cursor) {
//         url += `&next_cursor=${next_cursor}`
//       }

//       const response = await fetch(url,{
//         credentials: 'include',
//       })
//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error('Error:', err)
//     }
//   },

//   getFolders: async () => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.baseApiURL}${API_ENDPOINTS_SHARED.FILE_MANAGE.GET_FOLDERS()}`,{
//         credentials: 'include',
//       })
//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error('Error:', err)
//     }
//   },

//   deleteImage: async (publicId: string) => {
//     try {
//       const encodedId = encodeURIComponent(publicId)
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS_SHARED.FILE_MANAGE.DELETE_IMAGE(encodedId)}`, {
//         method: 'DELETE',
//         credentials: 'include',
//       })
//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error('Error:', err)
//     }
//   },

//   deleteImages: async (publicIds: string[]) => {
//     try {
//       const response = await fetchWithAuthAdmin(
//       `${apiConfig.baseApiURL}${API_ENDPOINTS_SHARED.FILE_MANAGE.DELETE_IMAGES}`,
//       {
//           method: 'DELETE',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ publicIds }),
//         }
//       )

//       return await response.json()
//     } catch (err) {
//       console.error('Delete images error:', err)
//       return { success: false }
//     }
//   },

//   searchImage: async (url: string, folder?: string) => {
//     try {
//       const params = new URLSearchParams()
//       params.append('url', url)
//       if (folder) params.append('folder', folder)

//       const response = await fetch(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS_SHARED.FILE_MANAGE.SEARCH_IMAGE()}?${params.toString()}`,{
//           credentials: 'include',
//         }
//       )

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error('Error in searchImage:', err)
//       return { success: false, message: String(err) }
//     }
//   },

//   uploadImage: async (files: File[], folder: string) => {
//     try {
//       const formData = new FormData()

//       files.forEach((file) => {
//         formData.append('files', file)
//       })

//       formData.append('folder', folder)

//       const response = await fetch(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS_SHARED.FILE_MANAGE.UPLOAD}`,
//         {
//           method: 'POST',
//           credentials: 'include',
//           body: formData,
//         }
//       )

//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error('Upload image error:', err)
//       return { success: false, message: 'Upload failed' }
//     }
//   },
// }