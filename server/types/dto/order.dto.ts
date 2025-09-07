import type { ProductDTO } from './product.dto.js';
import { Types } from "mongoose";

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
  // paymentId: string;
  cartItems: cartItems[];
  totalPrice: number;
  totalPriceSave: number;
  totalPriceCurrent: number;
  point: number;
  status: OrderStatusDTO;
  // status: string;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderBody extends Omit<OrderDTO, "id" | "createdAt" | "updatedAt" | "paymentId" | "status"> {
  paymentId: string;
  status: string;
}
// export type UpdateOrderBody = Partial<Omit<CreateOrderBody, "createdAt" | "updatedAt">>

// export interface Payment {
//   _id: string
//   name: string
//   description: string
//   image: string
// }

// export interface OrderStatus {
//   _id: string
//   name: string
//   status: string
//   icon: string
// }

// export interface Order {
//   _id: string
//   code: string
//   time: string
//   address: string
//   fullname: string
//   phone: string
//   note: string
//   paymentId: Types.ObjectId
//   cartItems: cartItems[]
//   totalPrice: number
//   totalPriceSave: number
//   totalPriceCurrent: number
//   point: number
//   status: string
//   userId: Types.ObjectId | null
//   createdAt: string
// }