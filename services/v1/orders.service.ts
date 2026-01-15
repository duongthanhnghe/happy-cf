import { API_ENDPOINTS } from "@/services/const/api.const";
import type {
  CreateOrderBody,
  OrderDTO,
  OrderPaginationDTO,
  OrderStatusCountDTO,
  OrderStatusDTO,
  PaymentDTO,
} from "@/server/types/dto/v1/order.dto";
import type { ApiResponse } from "@server/types/common/api-response";
import type { PendingRewardData, RewardHistoryDTO, RewardHistoryPaginationDTO } from "@/server/types/dto/v1/reward-history.dto";
import { apiClient } from "../http/apiClient";
import { apiError } from "@/server/types/common/api-response"
import { paginationError } from "@/server/types/common/pagination.dto";

export const ordersAPI = {
  getAllStatus: async (): Promise<ApiResponse<OrderStatusDTO[]>> => {
    try {
      return await apiClient().get<ApiResponse<OrderStatusDTO[]>>(API_ENDPOINTS.ORDERS.LIST_STATUS);
    } catch (err: any) {
      console.error("Error fetching order status:", err);
      return apiError<OrderStatusDTO[]>(err)
    }
  },

  getAllPayment: async (): Promise<ApiResponse<PaymentDTO[]>> => {
    try {
      return await apiClient().get<ApiResponse<PaymentDTO[]>>(API_ENDPOINTS.ORDERS.LIST_PAYMENTS);
    } catch (err: any) {
      console.error("Error fetching payments:", err);
      return apiError<PaymentDTO[]>(err)
    }
  },

  create: async (
    bodyData: CreateOrderBody,
    point: number,
    usedPoint: number
  ): Promise<ApiResponse<OrderDTO>> => {
    try {
      return await apiClient().post<ApiResponse<OrderDTO>>(
        API_ENDPOINTS.ORDERS.CREATE,
        { data: bodyData, point, usedPoint }
      );
    } catch (err: any) {
      console.error("Error creating order:", err);
      return apiError<OrderDTO>(err)
    }
  },

  getDetail: async (id: string): Promise<ApiResponse<OrderDTO>> => {
    try {
      return await apiClient().get<ApiResponse<OrderDTO>>(
        API_ENDPOINTS.ORDERS.GET_BY_ID(id)
      );
    } catch (err: any) {
      console.error(`Error getting order detail with ID ${id}:`, err);
      return apiError<OrderDTO>(err)
    }
  },

  getByUserId: async (
    userId: string,
    page = 1,
    limit = 10,
    statusId?: string
  ): Promise<OrderPaginationDTO> => {
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: limit.toString(),
      };
      if (statusId) params.statusId = statusId;

      return await apiClient().get<OrderPaginationDTO>(
        API_ENDPOINTS.ORDERS.LIST_BY_USER(userId),
        params
      );
    } catch (err: any) {
      console.error(`Error getting orders for user ${userId}:`, err);
      return paginationError<OrderDTO>(page, limit, err)
    }
  },

  getRewardHistoryByUserId: async (
    userId: string,
    page = 1,
    limit = 10
  ): Promise<RewardHistoryPaginationDTO> => {
    try {
      const params = { page: page.toString(), limit: limit.toString() };
      return await apiClient().get<RewardHistoryPaginationDTO>(
        API_ENDPOINTS.ORDERS.LIST_REWARDS_BY_USER(userId),
        params
      );
    } catch (err: any) {
      console.error(`Error fetching reward history for user ${userId}:`, err);
      return paginationError<RewardHistoryDTO>(page, limit, err)
    }
  },

  checkPoint: async (
    userId: string,
    usedPoint: number,
    orderTotal: number
  ): Promise<ApiResponse<{ appliedPoint: number }>> => {
    try {
      return await apiClient().post<ApiResponse<{ appliedPoint: number }>>(
        API_ENDPOINTS.ORDERS.CHECK_POINT,
        { userId, usedPoint, orderTotal }
      );
    } catch (err: any) {
      console.error("Error checking point:", err);
      return apiError<{ appliedPoint: number }>(err)
    }
  },

  getFee: async (payload: {
    PRODUCT_WEIGHT: number;
    PRODUCT_PRICE: number;
    MONEY_COLLECTION: number;
    SENDER_PROVINCE: number;
    SENDER_DISTRICT: number;
    RECEIVER_PROVINCE: number;
    RECEIVER_DISTRICT: number;
  }) => {
    try {
      return await apiClient().post<ApiResponse<number>>(
        API_ENDPOINTS.ORDERS.SHIPPING_FEE,
        payload
      );
    } catch (err: any) {
      console.error("Error fetching shipping fee:", err);
      return apiError<number>(err)
    }
  },

  cancelOrderByUser: async (
    orderId: string,
    userId: string
  ): Promise<ApiResponse<OrderDTO>> => {
    try {
      return await apiClient().post<ApiResponse<OrderDTO>>(
        API_ENDPOINTS.ORDERS.CANCEL_REQUEST,
        { orderId, userId }
      );
    } catch (err: any) {
      console.error("Cancel order error:", err);
      return apiError<OrderDTO>(err)
    }
  },

  getPendingRewardPoints: async (
    userId: string
  ): Promise<ApiResponse<PendingRewardData>> => {
    try {
      return await apiClient().get<ApiResponse<PendingRewardData>>(
        API_ENDPOINTS.ORDERS.PENDING_REWARD(userId)
      );
    } catch (err: any) {
      console.error("Error fetching pending reward points:", err);
      return apiError<PendingRewardData>(err)
    }
  },

  getOrderCountByStatusByUser: async (): Promise<ApiResponse<OrderStatusCountDTO[]>> => {
    try {
      return await apiClient().authGet<ApiResponse<OrderStatusCountDTO[]>>(
        API_ENDPOINTS.ORDERS.COUNT_BY_STATUS
      )
    } catch (err: any) {
      console.error("Error fetching user order count by status:", err)
      return apiError<OrderStatusCountDTO[]>(err)
    }
  }
};

// import { API_ENDPOINTS } from '@/services/const/api.const'
// import type {
//   CreateOrderBody,
//   OrderDTO,
//   OrderPaginationDTO,
// } from '@/server/types/dto/v1/order.dto'
// import type { ApiResponse } from '@server/types/common/api-response'
// import type { PendingRewardData } from '@/server/types/dto/v1/reward-history.dto';

// export const ordersAPI = {
  
//   create: async (
//     bodyData: CreateOrderBody,
//     userId: string | null,
//     point: number,
//     usedPoint: number,
//   ): Promise<ApiResponse<OrderDTO>> => {
//     try {
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.ORDERS.CREATE}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ data: bodyData, userId, point, usedPoint }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         return {
//           code: errorData.code ?? 1,
//           message: errorData.message ?? 'Có lỗi xảy ra',
//           data: errorData.data,
//         }
//       }

//       const data: ApiResponse<OrderDTO> = await response.json()
//       return data
//     } catch (err) {
//       console.error('Error creating order:', err)
//       return {
//         code: 1,
//         message: 'Unexpected error while creating order',
//         data: undefined as any,
//       }
//     }
//   },

//   getDetail: async (id: string): Promise<ApiResponse<OrderDTO>> => {
//     try {
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.ORDERS.GET_BY_ID(id)}`)
//       if (!response.ok) {
//         throw new Error(`Failed to fetch order with ID ${id}`)
//       }
//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error(`Error getting order detail with ID ${id}:`, err)
//       throw err
//     }
//   },

//   getByUserId: async (
//     userId: string,
//     page = 1,
//     limit = 10,
//     statusId: string,
//   ): Promise<OrderPaginationDTO> => {
//     try {
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//       });

//       if (statusId) params.append("statusId", statusId)

//       const response = await fetchWithAuth(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS.ORDERS.LIST_BY_USER(userId)}?${params}`
//       );

//       if (!response.ok) {
//         const err = await response.json();
//         return {
//           code: 1,
//           message: err.message || 'Failed to fetch orders',
//           data: [],
//           pagination: {
//             page,
//             limit,
//             total: 0,
//             totalPages: 0
//           }
//         };
//       }

//       const data: OrderPaginationDTO = await response.json();
//       return data;

//     } catch (err) {
//       console.error(`Error getting orders for user ${userId}:`, err);
//       return {
//         code: 1,
//         message: `Failed to fetch orders for user ${userId}`,
//         data: [],
//         pagination: {
//           page,
//           limit,
//           total: 0,
//           totalPages: 0
//         }
//       };
//     }
//   },

//   getRewardHistoryByUserId: async (
//     userId: string,
//     page = 1,
//     limit = 10
//   ): Promise<any> => {
//     try {
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//       })

//       const response = await fetchWithAuth(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS.ORDERS.LIST_REWARDS_BY_USER(userId)}?${params}`
//       )

//       if (!response.ok) {
//         const errorData = await response.json()
//         return {
//           code: 1,
//           message: errorData.message || 'Failed to fetch reward history',
//           data: [],
//           pagination: {
//             page,
//             limit,
//             total: 0,
//             totalPages: 0
//           }
//         }
//       }

//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error(`Error fetching reward history for user ${userId}:`, err)
//       return {
//         code: 1,
//         message: `Failed to fetch reward history for user ${userId}`,
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
//   checkPoint: async (
//     userId: string,
//     usedPoint: number,
//     orderTotal: number
//   ): Promise<ApiResponse<{ appliedPoint: number }>> => {
//     try {
//       const response = await fetchWithAuth(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS.ORDERS.CHECK_POINT}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ userId, usedPoint, orderTotal }),
//         }
//       )

//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error("Error checking point:", err)
//       return {
//         code: 1,
//         message: "Unexpected error while checking point",
//         data: { appliedPoint: 0 },
//       }
//     }
//   },
//   getFee: async (payload: {
//     PRODUCT_WEIGHT: number
//     PRODUCT_PRICE: number
//     MONEY_COLLECTION: number
//     SENDER_PROVINCE: number
//     SENDER_DISTRICT: number
//     RECEIVER_PROVINCE: number
//     RECEIVER_DISTRICT: number
//   }) => {
//     try {
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.ORDERS.SHIPPING_FEE}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(payload)
//       })

//       if (!response.ok) {
//         const errText = await response.text()
//         return {
//           code: 1,
//           message: `Failed to get shipping fee: ${errText}`,
//           data: null
//         }
//       }

//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error("Error fetching shipping fee:", err)
//       return {
//         code: 1,
//         message: "Unexpected error while getting shipping fee",
//         data: null
//       }
//     }
//   },
//   cancelOrderByUser: async (
//     orderId: string,
//     userId: string,
//   ): Promise<any> => {
//     try {
//       const response = await fetchWithAuth(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS.ORDERS.CANCEL_REQUEST}`, 
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ orderId,userId })
//         }
//       );

//       const data = await response.json();

//       if (!response.ok || data.code !== 0) {
//         return {
//           code: 1,
//           message: data.message || "Hủy đơn thất bại",
//           data: null,
//         };
//       }

//       return data as ApiResponse<OrderDTO>;

//     } catch (err: any) {
//       console.error("Cancel order error:", err);
//       return {
//         code: 1,
//         message: err.message || "Hủy đơn thất bại",
//         data: null,
//       };
//     }
//   },
//   getPendingRewardPoints: async (
//     userId: string
//   ): Promise<ApiResponse<PendingRewardData>> => {
//     try {
//       const response = await fetchWithAuth(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS.ORDERS.PENDING_REWARD(userId)}`
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         return {
//           code: 1,
//           message: data.message || "Failed to fetch pending reward points",
//           data: { totalPendingPoints: 0, orders: 0 },
//         }
//       }

//       return data;

//     } catch (err: any) {
//       console.error("Error fetching pending reward points:", err);
//       return {
//         code: 1,
//         message: err.message || "Error fetching pending reward points",
//         data: { totalPendingPoints: 0, orders: 0 },
//       }
//     }
//   },
// }
