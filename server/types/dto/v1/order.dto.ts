import type { ProductDTO } from './product.dto';
import type { PaymentTransactionDTO, PaymentMethod } from './payment-transaction.dto';
import type { PaginationDTO } from '../../common/pagination.dto'
import type { ApplyVoucherResponse } from './voucher.dto';
import type { ProductVariantCombinationDTO } from './product.dto';
export interface ProductInOrder extends cartItems {
  data: ProductDTO
}

export interface OrderMappingNew extends OrderDTO {
  productList: ProductInOrder[]
}

export interface cartItems {
  idProduct: { image: string, productName: string} | string
  price: number
  quantity: number
  sku: string | null
  note: string | null
  variantCombination: ProductVariantCombinationDTO
  combinationId: string
}

export type IdOrder = { id: string }

export type IdUser = { userId: string }

export interface OrderStatusCountDTO {
  statusId: string | 'all'
  status: string | 'all'
  name: string
  icon?: string
  index?: number
  count: number
}

export type ShippingStatus =
  | 'pending'     // chờ xử lý
  | 'picked'      // đã lấy hàng
  | 'shipping'    // đang giao
  | 'delivered'   // giao thành công
  | 'returned'    // hoàn hàng
  | 'cancelled'

  export interface ShippingProviderDTO {
  id: string
  name: string
  code: string
  logo?: string
}

export interface OrderShippingLogDTO {
  status: ShippingStatus
  description: string
  time: string
}

export interface OrderShippingDTO {
  id: string
  provider: ShippingProviderDTO | null
  trackingCode: string | null
  status: ShippingStatus
  shippingFee: number
  shippedAt: string | null
  deliveredAt: string | null
  logs: OrderShippingLogDTO[]
}

export interface CreateOrderShippingDTO {
  orderId: string
  providerId: string
  trackingCode: string
  shippingFee: number
}

export interface PaymentDTO {
  id: string;
  name: string;
  description: string;
  image: string;
  method: PaymentMethod,
}

export interface OrderStatusDTO {
  id: string;
  name: string;
  status: string;
  icon: string;
  index: number;
}

export interface OrderDTO {
  id: string;
  code: string;
  time: string;
  address: string;
  provinceCode: number;
  districtCode: number;
  wardCode: number;
  provinceName: string;
  districtName: string;
  wardName: string;
  fullname: string;
  phone: string;
  note: string;
  paymentId: PaymentDTO;
  cartItems: cartItems[];
  stockDeducted: boolean;
  totalPrice: number;
  totalPriceSave: number;
  totalPriceCurrent: number;
  totalDiscountOrder: number;
  shippingFee: number;
  shipping?: OrderShippingDTO | null;
  status: OrderStatusDTO;
  userId: string | null;
  cancelRequested: boolean;
  transaction: PaymentTransactionDTO | null;
  reward: {
    points: number,
    awarded: boolean,
    awardedAt: string | null;
  };
  usedPoints: number;
  pointsRefunded: boolean;
  membershipDiscountRate: number;
  membershipDiscountAmount: number;
  voucherUsage: ApplyVoucherResponse[];
  voucherRefunded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderBody extends Omit<OrderDTO, "id" | "createdAt" | "updatedAt" | "paymentId" | "status" | "transaction" | "reward" | "usedPoints" | "pointsRefunded" | "membershipDiscountRate" | "membershipDiscountAmount" | "voucherRefunded" | "cancelRequested" | "stockDeducted" | "shipping"> {
  paymentId: string;
  status: string;
  provinceCode: number;
  districtCode: number;
  wardCode: number;
  provinceName: string;
  districtName: string;
  wardName: string;
}

export type OrderPaginationDTO = PaginationDTO<OrderDTO>

export interface ShippingFeeDTO {
  // MONEY_TOTAL_OLD: number,
  MONEY_TOTAL: number,
  // MONEY_TOTAL_FEE: number,
  // MONEY_FEE: number,
  // MONEY_COLLECTION_FEE: number,
  // MONEY_OTHER_FEE: number,
  // MONEY_VAS: number,
  // MONEY_VAT: number,
  // KPI_HT: number,
}
