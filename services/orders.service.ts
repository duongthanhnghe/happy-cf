import { apiConfig } from '@/config/api.config'
import { API_ENDPOINTS } from '@/const/api.const'
import type {
  CreateOrderBody,
  OrderDTO,
  OrderStatusDTO,
  PaymentDTO,
} from '@server/types/dto/order.dto'
import type { ApiResponse } from '@server/types/common/api-response'

export const ordersAPI = {
  getAll: async (): Promise<ApiResponse<OrderDTO[]>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.ORDERS.LIST}`)
      const data = await response.json()
      return data
    } catch (err) {
      console.error('Error:', err)
      return {
        code: 1,
        message: 'Failed to fetch orders',
        data: [],
      }
    }
  },

  create: async (
    bodyData: CreateOrderBody,
    userId: string | null,
    point: number
  ): Promise<ApiResponse<OrderDTO>> => {
    try {
      if (!bodyData.fullname || !bodyData.phone || !bodyData.paymentId || !bodyData.cartItems?.length) {
        return {
          code: 1,
          message: 'Missing required fields: fullname, phone, paymentId, cartItems',
          data: undefined as any,
        }
      }

      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.ORDERS.CREATE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: bodyData, userId, point }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          code: 1,
          message: errorData,
          data: undefined as any,
        }
      }

      const data: ApiResponse<OrderDTO> = await response.json()
      return data
    } catch (err) {
      console.error('Error creating order:', err)
      return {
        code: 1,
        message: 'Unexpected error while creating order',
        data: undefined as any,
      }
    }
  },

  getDetail: async (id: string): Promise<ApiResponse<OrderDTO>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.ORDERS.GET_BY_ID(id)}`)
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
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.ORDERS.DELETE(id)}`, {
        method: 'DELETE',
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

  getByUserId: async (userId: string): Promise<ApiResponse<OrderDTO[]>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.ORDERS.LIST_BY_USER(userId)}`)
      const data = await response.json()
      return data
    } catch (err) {
      console.error(`Error getting orders for user ${userId}:`, err)
      return {
        code: 1,
        message: `Failed to fetch orders for user ${userId}`,
        data: [],
      }
    }
  },

  getAllStatus: async (): Promise<ApiResponse<OrderStatusDTO[]>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.ORDERS.LIST_STATUS}`)
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
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.ORDERS.LIST_PAYMENTS}`)
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
}
