import type { ProductDTO } from './product.dto';
import type { PaymentTransactionDTO, PaymentMethod } from './payment-transaction.dto';
import { Types } from "mongoose";
import type { PaginationDTO } from '../../common/pagination.dto'
import type { ApplyVoucherResponse } from './voucher.dto';

export interface ProductInOrder extends cartItems {
  data: ProductDTO
}

export interface OrderMappingNew extends OrderDTO {
  productList: ProductInOrder[]
}

export interface cartItems {
  idProduct: string | Types.ObjectId
  priceDiscounts: number
  quantity: number
  note: string | null
  selectedOptionsPush: selectedOptionsPush[] | null
  finalPriceDiscounts: number | null
}

export interface selectedOptionsPush {
  optionName: string
  variantName: string
  variantPrice: number
}

export type IdOrder = { id: string }

export type IdUser = { userId: string }

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
  fullname: string;
  phone: string;
  note: string;
  paymentId: PaymentDTO;
  cartItems: cartItems[];
  totalPrice: number;
  totalPriceSave: number;
  totalPriceCurrent: number;
  totalDiscountOrder: number;
  shippingFee: number;
  status: OrderStatusDTO;
  userId: string | null;
  transaction: PaymentTransactionDTO | null;
  reward: {
    points: number,
    awarded: boolean,
    awardedAt: string | null;
  };
  usedPoints: number;
  pointsRefunded: boolean
  membershipDiscountRate: number;
  membershipDiscountAmount: number;
  voucherUsage: ApplyVoucherResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderBody extends Omit<OrderDTO, "id" | "createdAt" | "updatedAt" | "paymentId" | "status" | "transaction" | "reward" | "usedPoints" | "pointsRefunded" | "membershipDiscountRate" | "membershipDiscountAmount"> {
  paymentId: string;
  status: string;
  provinceCode: number;
  districtCode: number;
  wardCode: number;
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
