import type {
  GiftItems,
  OrderDTO,
  OrderShippingDTO,
  OrderStatusDTO,
  PaymentDTO,
  ShippingProviderDTO,
  ShippingStatus,
  cartItems,
} from "../../types/dto/v1/order.dto";
import type { Order, OrderStatus, Payment, ShippingProvider, OrderShipping } from "../../models/v1/order.entity";
import { Types } from "mongoose";
import { toPaymentTransactionDTO } from "./payment-transaction.mapper"

export function toShippingProviderDTO(entity: ShippingProvider): ShippingProviderDTO {
  return {
    id: entity._id?.toString() || "",
    name: entity.name,
    code: entity.code,
    logo: entity.logo || "",
  }
}

export const toShippingProviderListDTO = (list: ShippingProvider[]): ShippingProviderDTO[] =>
  list.map(toShippingProviderDTO);

export function toOrderShippingDTO(entity: OrderShipping): OrderShippingDTO {
  const allowedStatus: ShippingStatus[] = [
    'pending', 'picked', 'shipping', 'delivered', 'returned', 'cancelled'
  ]

  const provider =
    entity.providerId && typeof entity.providerId === 'object'
      ? toShippingProviderDTO(entity.providerId as any)
      : null

  return {
    id: entity._id?.toString() || "",
    provider,
    trackingCode: entity.trackingCode ?? null,
    status: allowedStatus.includes(entity.status as any)
      ? (entity.status as ShippingStatus)
      : 'pending',
    shippingFee: entity.shippingFee ?? 0,
    shippedAt: entity.shippedAt
      ? new Date(entity.shippedAt).toISOString()
      : null,
    deliveredAt: entity.deliveredAt
      ? new Date(entity.deliveredAt).toISOString()
      : null,
    logs: (entity.logs || []).map(log => ({
      status: allowedStatus.includes(log.status as any)
        ? (log.status as ShippingStatus)
        : 'pending',
      description: log.description,
      time: new Date(log.time).toISOString()
    })),
    createdAt: entity.createdAt?.toISOString() || '',
    updatedAt: entity.updatedAt?.toISOString() || '',
  }
}

export function toPaymentDTO(entity: Payment): PaymentDTO {
  return {
    id: entity._id?.toString() || "",
    name: entity.name,
    description: entity.description || "",
    image: entity.image || "",
    method: entity.method || null,
    isActive: entity.isActive,
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
    provinceName: entity.provinceName,
    districtName: entity.districtName,
    wardName: entity.wardName,
    phone: entity.phone,
    note: entity.note || "",
    paymentId: toPaymentDTO(entity.paymentId as any),
    cartItems: Array.isArray(entity.cartItems)
      ? entity.cartItems.map(toCartItemDTO)
      : [],
    giftItems: Array.isArray(entity.giftItems)
      ? entity.giftItems.map(toGiftItemDTO)
      : [],
    stockDeducted: entity.stockDeducted,
    totalPrice: entity.totalPrice,
    totalPriceSave: entity.totalPriceSave,
    totalPriceCurrent: entity.totalPriceCurrent,
    totalDiscountOrder: entity.totalDiscountOrder,
    shippingFee: entity.shippingFee,
    shipping: entity.shipping
      ? toOrderShippingDTO(entity.shipping as any)
      : null,
    status:toOrderStatusDTO(entity.status as any),
    userId: entity.userId
      ? (entity.userId as any)._id
        ? (entity.userId as any)._id.toString()
        : entity.userId.toString()           
      : null,
    cancelRequested: entity.cancelRequested,
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

export function toOrderExport(entity: any) {
  const shipping = entity.shipping;
  const transaction = entity.transaction;
  const status = entity.status;
  const payment = entity.paymentId;
  const user = entity.userId;

  return {
    orderId: entity._id?.toString(),
    code: entity.code,
    time: entity.time,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,

    fullname: entity.fullname,
    phone: entity.phone,
    address: entity.address,
    provinceName: entity.provinceName,
    districtName: entity.districtName,
    wardName: entity.wardName,
    note: entity.note ?? "",

    totalPrice: entity.totalPrice,
    totalPriceSave: entity.totalPriceSave,
    totalPriceCurrent: entity.totalPriceCurrent,
    totalDiscountOrder: entity.totalDiscountOrder,
    shippingFee: entity.shippingFee,

    orderStatusCode: status?.status ?? "",
    orderStatusName: status?.name ?? "",

    paymentMethod: payment?.method ?? "",
    paymentName: payment?.name ?? "",

    transactionCode: transaction?.code ?? "",
    transactionStatus: transaction?.status ?? "",
    transactionAmount: transaction?.amount ?? 0,

    shippingStatus: shipping?.status ?? "",
    shippingStatusText: shipping?.statusText ?? "",
    shippingProvider: shipping?.providerId?.name ?? "",
    shippingTrackingCode: shipping?.trackingCode ?? "",
    shippedAt: shipping?.shippedAt ?? "",
    deliveredAt: shipping?.deliveredAt ?? "",

    userId: user?._id?.toString() ?? "",
    userEmail: user?.email ?? "",
    userPhone: user?.phone ?? "",

    usedPoints: entity.usedPoints ?? 0,
    rewardPoints: entity.reward?.points ?? 0,
    rewardAwarded: entity.reward?.awarded ?? false,
    rewardAwardedAt: entity.reward?.awardedAt ?? "",

    stockDeducted: entity.stockDeducted,
    cancelRequested: entity.cancelRequested,
    voucherRefunded: entity.voucherRefunded,
    pointsRefunded: entity.pointsRefunded,

    cartItems: Array.isArray(entity.cartItems)
      ? entity.cartItems
          .map((i: any) => `${i.idProduct?.productName} x${i.quantity}`)
          .join(" | ")
      : "",

    voucherCodes: Array.isArray(entity.voucherUsage)
      ? entity.voucherUsage.map((v: any) => v.code).join(", ")
      : "",
  };
}

function toCartItemDTO(entity: cartItems): cartItems {
  let idProduct: any = entity.idProduct;

  if (typeof idProduct === "string") {
    idProduct = new Types.ObjectId(idProduct);
  }
  else if (idProduct instanceof Types.ObjectId) {
  }
  else if (typeof idProduct === "object" && idProduct !== null) {
    // giữ nguyên object
  }
  else {
    idProduct = new Types.ObjectId()
  }

  return {
    idProduct,
    price: entity.price,
    quantity: entity.quantity,
    note: entity.note || "",
    sku: entity.sku,
    variantCombination: entity.variantCombination,
    combinationId: entity.combinationId || "",
  };
}

function toGiftItemDTO(entity: GiftItems): GiftItems {
  let idProduct: any = entity.idProduct;

  if (typeof idProduct === "string") {
    idProduct = new Types.ObjectId(idProduct);
  }
  else if (idProduct instanceof Types.ObjectId) {
  }
  else if (typeof idProduct === "object" && idProduct !== null) {
    // giữ nguyên object
  }
  else {
    idProduct = new Types.ObjectId()
  }

  return {
    promotionGiftId: entity.promotionGiftId,
    idProduct,
    price: entity.price,
    quantity: entity.quantity,
    sku: entity.sku,
    variantCombination: entity.variantCombination,
    combinationId: entity.combinationId || "",
  };
}
