import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS } from '@/services/const/api.const'
import type {
  CreateOrderBody,
  OrderDTO,
  OrderStatusDTO,
  PaymentDTO,
  OrderPaginationDTO,
} from '@/server/types/dto/v1/order.dto'
import type { ApiResponse } from '@server/types/common/api-response'

const APP_URL = process.env.DOMAIN || "http://localhost:3000";

export const ordersAPI = {
  
  create: async (
    bodyData: CreateOrderBody,
    userId: string | null,
    point: number,
    usedPoint: number,
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
        body: JSON.stringify({ data: bodyData, userId, point, usedPoint }),
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

  getByUserId: async (
    userId: string,
    page = 1,
    limit = 10,
    statusId: string,
  ): Promise<OrderPaginationDTO> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (statusId) params.append("statusId", statusId)

      const response = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.ORDERS.LIST_BY_USER(userId)}?${params}`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const err = await response.json();
        return {
          code: 1,
          message: err.message || 'Failed to fetch orders',
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0
          }
        };
      }

      const data: OrderPaginationDTO = await response.json();
      return data;

    } catch (err) {
      console.error(`Error getting orders for user ${userId}:`, err);
      return {
        code: 1,
        message: `Failed to fetch orders for user ${userId}`,
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      };
    }
  },

  getRewardHistoryByUserId: async (
    userId: string,
    page = 1,
    limit = 10
  ): Promise<any> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      const response = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.ORDERS.LIST_REWARDS_BY_USER(userId)}?${params}`,{
          credentials: 'include',
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        return {
          code: 1,
          message: errorData.message || 'Failed to fetch reward history',
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0
          }
        }
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error(`Error fetching reward history for user ${userId}:`, err)
      return {
        code: 1,
        message: `Failed to fetch reward history for user ${userId}`,
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
  checkPoint: async (
    userId: string,
    usedPoint: number,
    orderTotal: number
  ): Promise<ApiResponse<{ appliedPoint: number }>> => {
    try {
      const response = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.ORDERS.CHECK_POINT}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          body: JSON.stringify({ userId, usedPoint, orderTotal }),
        }
      )

      const data = await response.json()
      return data
    } catch (err) {
      console.error("Error checking point:", err)
      return {
        code: 1,
        message: "Unexpected error while checking point",
        data: { appliedPoint: 0 },
      }
    }
  },
  getFee: async (payload: {
    PRODUCT_WEIGHT: number
    PRODUCT_PRICE: number
    MONEY_COLLECTION: number
    SENDER_PROVINCE: number
    SENDER_DISTRICT: number
    RECEIVER_PROVINCE: number
    RECEIVER_DISTRICT: number
  }) => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.ORDERS.SHIPPING_FEE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errText = await response.text()
        return {
          code: 1,
          message: `Failed to get shipping fee: ${errText}`,
          data: null
        }
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error("Error fetching shipping fee:", err)
      return {
        code: 1,
        message: "Unexpected error while getting shipping fee",
        data: null
      }
    }
  },
  cancelOrderByUser: async (
    orderId: string,
    userId: string,
  ): Promise<any> => {
    try {
      const response = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.ORDERS.CANCEL_REQUEST}`, 
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId,userId })
        }
      );

      const data = await response.json();

      if (!response.ok || data.code !== 0) {
        return {
          code: 1,
          message: data.message || "Hủy đơn thất bại",
          data: null,
        };
      }

      return data as ApiResponse<OrderDTO>;

    } catch (err: any) {
      console.error("Cancel order error:", err);
      return {
        code: 1,
        message: err.message || "Hủy đơn thất bại",
        data: null,
      };
    }
  },
}
