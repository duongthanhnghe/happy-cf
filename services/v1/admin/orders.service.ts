import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin'
import type {
  OrderDTO,
  OrderStatusDTO,
  PaymentDTO,
  OrderPaginationDTO,
} from '@/server/types/dto/v1/order.dto'
import type { ApiResponse } from '@server/types/common/api-response'

export const ordersAPI = {
  // getAll: async (
  //   page = 1,
  //   limit = 10,
  //   fromDate = "",
  //   toDate = "",
  //   search = "",
  //   statusId = "",
  //   transactionId = "",
  // ): Promise<OrderPaginationDTO> => {
  //   try {
  //     const params = new URLSearchParams({
  //       page: page.toString(),
  //       limit: limit.toString(),
  //     })

  //     if (fromDate) params.append("fromDate", fromDate);
  //     if (toDate) params.append("toDate", toDate);
  //     if (search) params.append("search", search)
  //     if (statusId) params.append("statusId", statusId)
  //     if (transactionId) params.append("transactionId", transactionId)

  //     const response = await fetch(
  //       `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.LIST}?${params}`, {
  //         credentials: 'include',
  //       }
  //     )
  //     const data = await response.json()
  //     return data
  //   } catch (err) {
  //     console.error("Error:", err)
  //     return {
  //       code: 1,
  //       message: "Failed to fetch orders",
  //       data: [],
  //       pagination: {
  //         total: 0,
  //         totalPages: 0,
  //         page: 1,
  //         limit,
  //       },
  //     }
  //   }
  // },
  getAll: async (
    page = 1,
    limit = 10,
    fromDate = "",
    toDate = "",
    search = "",
    statusId = "",
    transactionId = "",
  ): Promise<OrderPaginationDTO> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);
      if (search) params.append("search", search);
      if (statusId) params.append("statusId", statusId);
      if (transactionId) params.append("transactionId", transactionId);

      const response = await fetch(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.LIST}?${params}`,
        { credentials: "include" }
      );

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error:", err);
      return {
        code: 1,
        message: "Failed to fetch orders",
        data: [],
        pagination: {
          total: 0,
          totalPages: 0,
          page: 1,
          limit,
        },
      };
    }
  },

  getDetail: async (id: string): Promise<ApiResponse<OrderDTO>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.GET_BY_ID(id)}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch order with ID ${id}`)
      }
      const data = await response.json()
      return data
    } catch (err) {
      console.error(`Error getting order detail with ID ${id}:`, err)
      throw err
    }
  },

  delete: async (id: string) => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.DELETE(id)}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (err) {
      console.error(`Error deleting order with ID ${id}:`, err)
      throw err
    }
  },

  getAllStatus: async (): Promise<ApiResponse<OrderStatusDTO[]>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.LIST_STATUS}`)
      const data = await response.json()
      return data
    } catch (err) {
      console.error('Error:', err)
      return {
        code: 1,
        message: 'Failed to fetch order status',
        data: [],
      }
    }
  },

  getAllPayment: async (): Promise<ApiResponse<PaymentDTO[]>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.LIST_PAYMENTS}`)
      const data = await response.json()
      return data
    } catch (err) {
      console.error('Error:', err)
      return {
        code: 1,
        message: 'Failed to fetch payments',
        data: [],
      }
    }
  },
  updateStatusOrder: async (orderId: string, statusId: string): Promise<ApiResponse<OrderDTO>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.UPDATE_STATUS}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orderId, statusId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          code: 1,
          message: errorData.message || 'Failed to update order status',
          data: undefined as any,
        }
      }

      const data: ApiResponse<OrderDTO> = await response.json()
      return data
    } catch (err) {
      console.error(`Error updating status for order ${orderId}:`, err)
      return {
        code: 1,
        message: 'Unexpected error while updating order status',
        data: undefined as any,
      }
    }
  },
}
