import type {
  OrderDTO,
  OrderStatusDTO,
  PaymentDTO,
  selectedOptionsPush,
  cartItems,
} from "../../types/dto/v1/order.dto";
import type { Order, OrderStatus, Payment } from "../../models/v1/order.entity";
import { Types } from "mongoose";
import { toPaymentTransactionDTO } from "./payment-transaction.mapper"

export function toPaymentDTO(entity: Payment): PaymentDTO {
  return {
    id: entity._id?.toString() || "",
    name: entity.name,
    description: entity.description || "",
    image: entity.image || "",
    method: entity.method || null,
  };
}

export const toPaymentListDTO = (payments: Payment[]): PaymentDTO[] =>
  payments.map(toPaymentDTO);

export function toOrderStatusDTO(entity: OrderStatus): OrderStatusDTO {
  return {
    id: entity._id?.toString() || "",
    name: entity.name,
    status: entity.status,
    icon: entity.icon || "",
    index: entity.index,
  };
}

export const toOrderStatusListDTO = (list: OrderStatus[]): OrderStatusDTO[] =>
  list.map(toOrderStatusDTO);

export function toOrderDTO(entity: Order): OrderDTO {
  return {
    id: entity._id?.toString() || "",
    code: entity.code,
    time: entity.time,
    address: entity.address,
    fullname: entity.fullname,
    provinceCode: entity.provinceCode,
    districtCode: entity.districtCode,
    wardCode: entity.wardCode,
    phone: entity.phone,
    note: entity.note || "",
    paymentId: toPaymentDTO(entity.paymentId as any),
    cartItems: Array.isArray(entity.cartItems)
      ? entity.cartItems.map(toCartItemDTO)
      : [],
    totalPrice: entity.totalPrice,
    totalPriceSave: entity.totalPriceSave,
    totalPriceCurrent: entity.totalPriceCurrent,
    totalDiscountOrder: entity.totalDiscountOrder,
    shippingFee: entity.shippingFee,
    status:toOrderStatusDTO(entity.status as any),
    userId: entity.userId
      ? (entity.userId as any)._id
        ? (entity.userId as any)._id.toString()
        : entity.userId.toString()           
      : null,
    transaction: entity.transaction ? toPaymentTransactionDTO(entity.transaction as any) : null,
    reward: entity.reward
      ? {
          points: entity.reward.points ?? 0,
          awarded: entity.reward.awarded ?? false,
          awardedAt: entity.reward.awardedAt
            ? new Date(entity.reward.awardedAt).toISOString()
            : null,
        }
      : {
          points: 0,
          awarded: false,
          awardedAt: null,
        },
    usedPoints: entity.usedPoints,
    pointsRefunded: entity.pointsRefunded,
    membershipDiscountRate: entity.membershipDiscountRate,
    membershipDiscountAmount: entity.membershipDiscountAmount,
    createdAt: entity.createdAt?.toISOString() || "",
    updatedAt: entity.updatedAt?.toISOString() || "",
    voucherRefunded: entity.voucherRefunded,
    voucherUsage: Array.isArray(entity.voucherUsage)
      ? entity.voucherUsage.map(v => ({
          code: v.code,
          type: v.type,
          discount: v.discount ?? 0,
          expiresAt: v.expiresAt ? new Date(v.expiresAt).toISOString() : undefined,
          stackable: v.stackable ?? false,
          applicableProducts: Array.isArray(v.applicableProducts)
            ? v.applicableProducts.map(p => ({
                productId: p.productId ? p.productId.toString() : "",
                name: p.name,
                categoryId: p.categoryId ? p.categoryId.toString() : "",
                price: p.price ?? 0,
                quantity: p.quantity ?? 0,
              }))
            : [],
        }))
      : []
  };
}

export const toOrderListDTO = (orders: Order[]): OrderDTO[] =>
  orders.map(toOrderDTO);

function toCartItemDTO(entity: cartItems): cartItems {
  return {
    idProduct: entity.idProduct
      ? new Types.ObjectId(entity.idProduct)
      : new Types.ObjectId(),
    priceDiscounts: entity.priceDiscounts,
    quantity: entity.quantity,
    note: entity.note || "",
    selectedOptionsPush: Array.isArray(entity.selectedOptionsPush)
      ? entity.selectedOptionsPush.map(toSelectedOptionDTO)
      : [],
    finalPriceDiscounts: entity.finalPriceDiscounts,
  };
}

function toSelectedOptionDTO(entity: selectedOptionsPush): selectedOptionsPush {
  return {
    optionName: entity.optionName,
    variantName: entity.variantName,
    variantPrice: entity.variantPrice,
  };
}
