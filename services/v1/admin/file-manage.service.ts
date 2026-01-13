import { apiAdmin } from '@/services/http/apiAdmin'
import { API_ENDPOINTS_ADMIN } from "@/services/const/api-endpoints-admin";
import { fetchRawAdmin } from '@/services/http/fetchRawAdmin';
import { cursorPaginationError, type DeleteImageResponse, type DeleteImagesResponse, type FileManageFolder, type FileManageImage, type GetFoldersResponse, type GetImagesResponse, type SearchImagesResponse, type UploadImagesResponse } from '@/server/types/dto/v1/file-manage.dto';
import { apiError } from '@/server/types/common/api-response'

export const fileManageAPI = {
  getImages: async (
    folder: string, 
    max_results: number, 
    next_cursor?: string
  ): Promise<GetImagesResponse> => {
    try {
      return await apiAdmin().get(API_ENDPOINTS_ADMIN.FILE_MANAGE.GET_IMAGES(folder, max_results),
      {
        max_results,
        ...(next_cursor ? { next_cursor } : {})
      }
      )
    } catch (err: any) {
      console.error('Error fetching images:', err)
      return cursorPaginationError(err, max_results)
    }
  },

  getFolders: async (): Promise<GetFoldersResponse> => {
    try {
      return await apiAdmin().get(API_ENDPOINTS_ADMIN.FILE_MANAGE.GET_FOLDERS())
    } catch (err: any) {
      console.error('Error fetching folders:', err)
      return apiError<FileManageFolder[]>(err)
    }
  },

  deleteImage: async (publicId: string): Promise<DeleteImageResponse> => {
    try {
      const encodedId = encodeURIComponent(publicId)
      return await apiAdmin().delete(API_ENDPOINTS_ADMIN.FILE_MANAGE.DELETE_IMAGE(encodedId))
    } catch (err: any) {
      console.error('Error deleting image:', err)
      return apiError<{public_id: string}>(err)
    }
  },

  deleteImages: async (publicIds: string[]): Promise<DeleteImagesResponse> => {
    try {
      return await apiAdmin().post(API_ENDPOINTS_ADMIN.FILE_MANAGE.DELETE_IMAGES, { publicIds })
    } catch (err: any) {
      console.error('Error deleting multiple images:', err)
      return apiError<{ public_id: string[] }>(err)
    }
  },

  searchImage: async (url: string, folder?: string): Promise<SearchImagesResponse> => {
    try {
      const params: Record<string, string> = { url }
      if (folder) params.folder = folder

      const query = new URLSearchParams(params).toString()
      return await apiAdmin().get(`${API_ENDPOINTS_ADMIN.FILE_MANAGE.SEARCH_IMAGE()}?${query}`)
    } catch (err: any) {
      console.error('Error searching image:', err)
      return apiError<FileManageImage[]>(err)
    }
  },

  
  uploadImage: async (files: File[], folder: string): Promise<UploadImagesResponse> => {
    try {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      formData.append('folder', folder)

      const res = await fetchRawAdmin(
        `${API_ENDPOINTS_ADMIN.FILE_MANAGE.UPLOAD}`,
        { method: "POST", body: formData, }
      )

      return res.json()
    } catch (err: any) {
      console.error('Error uploading images:', err)
      return apiError<FileManageImage[]>(err)
    }
  },
}

// import { API_ENDPOINTS_ADMIN } from '@/services/const/api.endpoints-shared'

// export const fileManageAPI = {
//   getImages: async (folder: string, max_results: number = 10, next_cursor?: string) => {
//     try {
//       let url = `${apiConfig.baseApiURL}${API_ENDPOINTS_ADMIN.FILE_MANAGE.GET_IMAGES(folder, max_results)}`
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
//       const response = await fetchWithAuthAdmin(`${apiConfig.baseApiURL}${API_ENDPOINTS_ADMIN.FILE_MANAGE.GET_FOLDERS()}`,{
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
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS_ADMIN.FILE_MANAGE.DELETE_IMAGE(encodedId)}`, {
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
//       `${apiConfig.baseApiURL}${API_ENDPOINTS_ADMIN.FILE_MANAGE.DELETE_IMAGES}`,
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
//         `${apiConfig.baseApiURL}${API_ENDPOINTS_ADMIN.FILE_MANAGE.SEARCH_IMAGE()}?${params.toString()}`,{
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
//         `${apiConfig.baseApiURL}${API_ENDPOINTS_ADMIN.FILE_MANAGE.UPLOAD}`,
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