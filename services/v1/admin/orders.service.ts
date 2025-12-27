import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin'
import type {
  OrderDTO,
  OrderStatusDTO,
  PaymentDTO,
  OrderPaginationDTO,
  ShippingProviderDTO,
  OrderShippingDTO,
  OrderStatusCountDTO,
} from '@/server/types/dto/v1/order.dto'
import type { ApiResponse } from '@server/types/common/api-response'
import { fetchWithAuthAdmin } from '@/services/helpers/fetchWithAuthAdmin'
import { useRuntimeConfig } from 'nuxt/app'


export const ordersAPI = {
  getAll: async (
    page = 1,
    limit = 10,
    fromDate = "",
    toDate = "",
    search = "",
    statusId = "",
    transactionId = "",
    shippingStatus = "",
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
      if (shippingStatus) params.append("shippingStatus", shippingStatus);

      const response = await fetchWithAuthAdmin(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.LIST}?${params}`);

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
      const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.GET_BY_ID(id)}`)
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
      const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.DELETE(id)}`, {
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

  getAllStatus: async (): Promise<ApiResponse<OrderStatusDTO[]>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.LIST_STATUS}`,{
          credentials: "include",
        })
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
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.LIST_PAYMENTS}`,{
          credentials: "include",
        })
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
      const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.UPDATE_STATUS}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
  getOrderCountByStatus: async (): Promise<ApiResponse<OrderStatusCountDTO[]>> => {
    try {
      const response = await fetchWithAuthAdmin(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.COUNT_BY_STATUS}`
      )

      if (!response.ok) {
        throw new Error('Fetch order count by status failed')
      }

      return await response.json()
    } catch (error) {
      console.error('getOrderCountByStatus error:', error)
      throw error
    }
  },
  printBill: async (id: string): Promise<void> => {
    try {
      const config = useRuntimeConfig()
      const siteName: any = config.public.siteName

      const url =
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.PRINT_BILL(id)}` +
        `?siteName=${encodeURIComponent(siteName)}`

      window.open(url, "_blank", "width=400,height=650")
    } catch (err) {
      console.error(`Error printing bill for order ${id}:`, err)
      throw err
    }
  },
  exportOrders: async (
    fromDate = "",
    toDate = "",
    search = "",
    statusId = "",
    transactionId = "",
    shippingStatus = ""
  ): Promise<{ code: number; message: string }> => {
    try {
      const params = new URLSearchParams();

      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);
      if (search) params.append("search", search);
      if (statusId) params.append("statusId", statusId);
      if (transactionId) params.append("transactionId", transactionId);
      if (shippingStatus) params.append("shippingStatus", shippingStatus);

      const response = await fetchWithAuthAdmin(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.EXPORT}?${params}`,
        {
          method: "GET",
        }
      );

      const contentType = response.headers.get("Content-Type");

      if (contentType?.includes("application/json")) {
        const json = await response.json();
        return {
          code: json.code ?? 1,
          message: json.message ?? "Export thất bại",
        };
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      let fileName = `order_export_${Date.now()}.xlsx`;

      const contentDisposition = response.headers.get("Content-Disposition");
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) fileName = match[1];
      }

      a.href = url;
      a.download = fileName;
      a.click();

      window.URL.revokeObjectURL(url);

      const codeHeader = response.headers.get("X-Code");
      const messageHeader =
        response.headers.get("X-Message") ?? "Export orders thành công";

      return {
        code: codeHeader ? Number(codeHeader) : 0,
        message: messageHeader,
      };
    } catch (err: any) {
      console.error("Error exporting orders:", err);
      return {
        code: 1,
        message: err.message ?? "Export thất bại",
      };
    }
  },
  getAllShippingProviders: async (
    active?: boolean
  ): Promise<ApiResponse<ShippingProviderDTO[]>> => {
    try {
      const params = new URLSearchParams()
      if (active !== undefined) {
        params.append('active', String(active))
      }

      const response = await fetchWithAuthAdmin(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.LIST_SHIPPING_PROVIDERS}?${params}`
      )

      return await response.json()
    } catch (error) {
      console.error('getAllShippingProviders error:', error)
      return {
        code: 1,
        message: 'Không thể lấy danh sách đơn vị vận chuyển',
        data: [],
      }
    }
  },

  getShippingProviderDetail: async (
    id: string
  ): Promise<ApiResponse<ShippingProviderDTO>> => {
    try {
      const response = await fetchWithAuthAdmin(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.DETAIL_SHIPPING_PROVIDERS(id)}`
      )

      if (!response.ok) {
        throw new Error('Fetch shipping provider failed')
      }

      return await response.json()
    } catch (error) {
      console.error('getShippingProviderDetail error:', error)
      throw error
    }
  },
  createOrderShipping: async (payload: {
    orderId: string
    providerId: string
    trackingCode?: string
    shippingFee?: number
  }): Promise<ApiResponse<OrderShippingDTO>> => {
    try {
      const response = await fetchWithAuthAdmin(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.CREATE_ORDER_SHIPPING}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        throw new Error('Create order shipping failed')
      }

      return await response.json()
    } catch (error) {
      console.error('createOrderShipping error:', error)
      throw error
    }
  },
  getOrderShippingDetail: async (
    id: string
  ): Promise<ApiResponse<OrderShippingDTO>> => {
    try {
      const response = await fetchWithAuthAdmin(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.DETAIL_ORDER_SHIPPING(id)}`
      )

      if (!response.ok) {
        throw new Error('Fetch shipping order failed')
      }

      return await response.json()
    } catch (error) {
      console.error('getOrderShippingDetail error:', error)
      throw error
    }
  },
  updateOrderShippingStatus: async (
    id: string,
    payload: {
      status: string
      statusText?: string
    }
  ): Promise<ApiResponse<OrderShippingDTO>> => {
    try {
      const response = await fetchWithAuthAdmin(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ORDERS.UPDATE_STATUS_ORDER_SHIPPING(id)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        throw new Error('Update shipping status failed')
      }

      return await response.json()
    } catch (error) {
      console.error('updateOrderShippingStatus error:', error)
      throw error
    }
  },
}
