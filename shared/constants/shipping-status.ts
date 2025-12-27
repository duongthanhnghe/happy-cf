import type { ShippingStatus } from "@/server/types/dto/v1/order.dto";

export interface ShippingStatusItem {
  name: string;
  status: ShippingStatus;
  color: string;
}

export const SHIPPING_STATUS: Record<ShippingStatus, ShippingStatusItem> = {
  pending: {
    name: "Chờ xử lý",
    status: "pending",
    color: "warning",
  },
  picked: {
    name: "Đã lấy hàng",
    status: "picked",
    color: "info",
  },
  shipping: {
    name: "Đang giao hàng",
    status: "shipping",
    color: "warning",
  },
  delivered: {
    name: "Giao thành công",
    status: "delivered",
    color: "success",
  },
  returned: {
    name: "Hoàn hàng",
    status: "returned",
    color: "error",
  },
  cancelled: {
    name: "Đã huỷ",
    status: "cancelled",
    color: "error",
  },
};
