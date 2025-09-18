import type { ProductDTO } from './product.dto.js';
import { Types } from "mongoose";
import type { PaginationDTO } from '../common/pagination.dto'

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
  fullname: string;
  phone: string;
  note: string;
  paymentId: PaymentDTO;
  cartItems: cartItems[];
  totalPrice: number;
  totalPriceSave: number;
  totalPriceCurrent: number;
  point: number;
  status: OrderStatusDTO;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderBody extends Omit<OrderDTO, "id" | "createdAt" | "updatedAt" | "paymentId" | "status"> {
  paymentId: string;
  status: string;
}

export type OrderPaginationDTO = PaginationDTO<OrderDTO>
