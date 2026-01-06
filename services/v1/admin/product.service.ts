import { API_ENDPOINTS_ADMIN } from "@/services/const/api-endpoints-admin"
import { apiAdmin } from "@/services/http/apiAdmin"
import type { ApiResponse } from "@server/types/common/api-response"
import type {
  ProductDTO,
  CreateProductDTO,
  UpdateProductDTO,
  ProductPaginationDTO
} from "@/server/types/dto/v1/product.dto"
import { fetchRawAdmin } from "@/services/http/fetchRawAdmin"

export const productsAPI = {
  getAll: async (
    page: number,
    limit: number,
    search: string,
    categoryId: string
  ): Promise<ProductPaginationDTO> => {
    try {
      const params: Record<string, any> = { page, limit, search, categoryId }
      return await apiAdmin().get<ProductPaginationDTO>(
        API_ENDPOINTS_ADMIN.PRODUCTS.LIST_ALL,
        params
      )
    } catch (err: any) {
      console.error('Error fetching all products:', err)
      return {
        code: 1,
        message: err.message ?? "Failed to fetch products",
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      }
    }
  },

  create: async (bodyData: CreateProductDTO): Promise<ApiResponse<ProductDTO>> => {
    try {
      return await apiAdmin().post<ApiResponse<ProductDTO>>(
        API_ENDPOINTS_ADMIN.PRODUCTS.CREATE,
        bodyData
      )
    } catch (err: any) {
      console.error('Error creating product:', err)
      return {
        code: 1,
        message: err.message ?? "Failed to create product",
        data: undefined as any
      }
    }
  },

  importProducts: async (file: File): Promise<ApiResponse<any>> => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      return await apiAdmin().post<ApiResponse<any>>(
        API_ENDPOINTS_ADMIN.PRODUCTS.IMPORT,
        formData
      )
    } catch (err: any) {
      console.error("Error importing products:", err)
      return {
        code: 1,
        message: err.message ?? "Failed to import products",
        data: null
      }
    }
  },

  updateImportProducts: async (file: File): Promise<ApiResponse<any>> => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      return await apiAdmin().post<ApiResponse<any>>(
        API_ENDPOINTS_ADMIN.PRODUCTS.UPDATE_IMPORT,
        formData
      )
    } catch (err: any) {
      console.error("Error updating import products:", err)
      return {
        code: 1,
        message: err.message ?? "Failed to update import products",
        data: null
      }
    }
  },

  exportProducts: async (): Promise<{
    code: number
    message: string
  }> => {
    try {
      const response = await fetchRawAdmin(
        API_ENDPOINTS_ADMIN.PRODUCTS.EXPORT,
        { method: "GET" }
      )

      const contentType = response.headers.get("content-type")

      if (contentType?.includes("application/json")) {
        const json = await response.json()
        return {
          code: json.code ?? 1,
          message: json.message ?? "Export thất bại",
        }
      }

      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      let fileName = `product_export_${Date.now()}.xlsx`
      const disposition = response.headers.get("content-disposition")
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/i)
        if (match?.[1]) fileName = match[1]
      }

      const a = document.createElement("a")
      a.href = blobUrl
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(blobUrl)

      return { code: 0, message: "Export thành công" }
    } catch (err: any) {
      console.error("[exportProducts]", err)
      return {
        code: 1,
        message: err.message ?? "Export thất bại",
      }
    }
  },

  getDetail: async (id: string): Promise<ApiResponse<ProductDTO>> => {
    try {
      return await apiAdmin().get<ApiResponse<ProductDTO>>(
        API_ENDPOINTS_ADMIN.PRODUCTS.GET_BY_ID(id)
      )
    } catch (err: any) {
      console.error(`Error getting product detail with ID ${id}:`, err)
      return {
        code: 1,
        message: err.message ?? "Failed to fetch product detail",
        data: undefined as any
      }
    }
  },

  update: async (id: string, bodyData: UpdateProductDTO): Promise<ApiResponse<ProductDTO>> => {
    try {
      return await apiAdmin().put<ApiResponse<ProductDTO>>(
        API_ENDPOINTS_ADMIN.PRODUCTS.UPDATE(id),
        bodyData
      )
    } catch (err: any) {
      console.error(`Error updating product with ID ${id}:`, err)
      return {
        code: 1,
        message: err.message ?? "Failed to update product",
        data: undefined as any
      }
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      return await apiAdmin().delete<ApiResponse<null>>(
        API_ENDPOINTS_ADMIN.PRODUCTS.DELETE(id)
      )
    } catch (err: any) {
      console.error(`Error deleting product with ID ${id}:`, err)
      return {
        code: 1,
        message: err.message ?? "Failed to delete product",
        data: null
      }
    }
  },

  deleteMany: async (ids: string[]): Promise<ApiResponse<null>> => {
    try {
      return await apiAdmin().post<ApiResponse<null>>(
        API_ENDPOINTS_ADMIN.PRODUCTS.DELETE_MANY,{ ids }
      )
    } catch (err: any) {
      console.error("Error deleting multiple products:", err)
      return {
        code: 1,
        message: err.message ?? "Failed to delete products",
        data: null
      }
    }
  },

  toggleActive: async (id: string): Promise<ApiResponse<ProductDTO>> => {
    try {
      return await apiAdmin().patch<ApiResponse<ProductDTO>>(
        API_ENDPOINTS_ADMIN.PRODUCTS.TOGGLE_ACTIVE(id)
      )
    } catch (err: any) {
      console.error(`Error toggling active status for product ID ${id}:`, err)
      return {
        code: 1,
        message: err.message ?? "Unexpected error while toggling active status",
        data: undefined as any
      }
    }
  }
}


// import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin'
// import type { 
//   ProductDTO, 
//   CreateProductDTO, 
//   UpdateProductDTO,
//   ProductPaginationDTO
// } from '@/server/types/dto/v1/product.dto'
// import type { ApiResponse } from '@/server/types/common/api-response'

// export const productsAPI = {
//   getAll: async (page: number, limit: number, search: string, categoryId: string): Promise<ProductPaginationDTO> => {
//     try {
//       const res = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.LIST_ALL}?page=${page}&limit=${limit}&search=${search}&categoryId=${categoryId}`)
//       const data = await res.json()
//       return data
//     } catch (err: any) {
//       console.error('Error fetching all products:', err)
//       return {
//         code: 1,
//         message: err.message ?? "Failed to fetch product",
//         data: [],
//         pagination: {
//           page,
//           limit,
//           total: 0,
//           totalPages: 0
//         }
//       }
//     }
//   },

//   create: async (bodyData: CreateProductDTO): Promise<ApiResponse<ProductDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.CREATE}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(bodyData)
//       })

//       const data = await response.json()
//       return data
//     } catch (err: any) {
//       console.error('Error creating product:', err)
//       return {
//         code: 1,
//         message: err.message ?? "Failed to create product",
//         data: null as any
//       }
//     }
//   },

//   importProducts: async (file: File): Promise<ApiResponse<any>> => {
//     try {
//       const formData = new FormData()
//       formData.append("file", file)

//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.IMPORT}`,
//         {
//           method: 'POST',
//           body: formData
//         }
//       )

//       const data = await response.json()
//       return data

//     } catch (err: any) {
//       console.error("Error importing products:", err)
//       return {
//         code: 1,
//         message: err.message ?? "Failed to import products",
//         data: null
//       }
//     }
//   },

//   exportProducts: async (): Promise<{ code: number; message: string }> => {
//     try {
//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.EXPORT}`,
//         {
//           method: "GET",
//         }
//       );

//       const contentType = response.headers.get("Content-Type");
//       if (contentType?.includes("application/json")) {
//         const json = await response.json();
//         return {
//           code: json.code ?? 1,
//           message: json.message ?? "Export thất bại",
//         };
//       }

//       const blob = await response.blob();

//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");

//       let fileName = `product_export_${Date.now()}.xlsx`;

//       const contentDisposition = response.headers.get("Content-Disposition");
//       if (contentDisposition) {
//         const match = contentDisposition.match(/filename="?([^"]+)"?/);
//         if (match) fileName = match[1];
//       }

//       a.href = url;
//       a.download = fileName;
//       a.click();

//       window.URL.revokeObjectURL(url);

//       const codeHeader = response.headers.get("X-Code");
//       const messageHeader = response.headers.get("X-Message") ?? "Export thành công";

//       return {
//         code: codeHeader ? Number(codeHeader) : 0,
//         message: messageHeader,
//       };

//     } catch (err: any) {
//       console.error("Error exporting products:", err);
//       return {
//         code: 1,
//         message: err.message ?? "Export thất bại",
//       };
//     }
//   },

//   updateImportProducts: async (file: File): Promise<ApiResponse<any>> => {
//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.UPDATE_IMPORT}`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       return await response.json();

//     } catch (err: any) {
//       return {
//         code: 1,
//         message: err.message ?? "Lỗi update import",
//         data: null
//       }
//     }
//   },

//   getDetail: async (id: string): Promise<ApiResponse<ProductDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.GET_BY_ID(id)}`)
//       const data = await response.json()
//       return data
//     } catch (err: any) {
//       console.error(`Error getting product detail with ID ${id}:`, err)
//       return {
//         code: 1,
//         message: err.message ?? "Failed to fetch product detail",
//         data: null as any
//       }
//     }
//   },

//   update: async (id: string, bodyData: UpdateProductDTO): Promise<ApiResponse<ProductDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.UPDATE(id)}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(bodyData)
//       })

//       const data = await response.json()
//       return data
//     } catch (err: any) {
//       console.error(`Error updating product with ID ${id}:`, err)
//       return {
//         code: 1,
//         message: err.message ?? "Failed to update product",
//         data: null as any
//       }
//     }
//   },

//   delete: async (id: string): Promise<ApiResponse<null>> => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.DELETE(id)}`, {
//         method: 'DELETE',
//       })

//       const data = await response.json()
//       return data
//     } catch (err: any) {
//       console.error(`Error deleting product with ID ${id}:`, err)
//       return {
//         code: 1,
//         message: err.message ?? "Failed to delete product",
//         data: null as any
//       }
//     }
//   },
  
//   deleteMany: async (ids: string[]): Promise<ApiResponse<null>> => {
//     try {
//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.DELETE_MANY}`,
//         {
//           method: 'DELETE',
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ ids })
//         }
//       )

//       const data = await response.json()
//       return data
//     } catch (err: any) {
//       return {
//         code: 1,
//         message: err.message ?? "Failed to delete products",
//         data: null
//       }
//     }
//   },

//   toggleActive: async (id: string): Promise<ApiResponse<ProductDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.TOGGLE_ACTIVE(id)}`, {
//         method: 'PATCH',
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         return {
//           code: 1,
//           message: errorData.message || 'Failed to toggle active status',
//           data: undefined as any
//         }
//       }

//       const data: ApiResponse<ProductDTO> = await response.json()
//       return data
//     } catch (err) {
//       console.error(`Error toggling active status for product ID ${id}:`, err)
//       return {
//         code: 1,
//         message: 'Unexpected error while toggling active status',
//         data: undefined as any
//       }
//     }
//   },
// }
