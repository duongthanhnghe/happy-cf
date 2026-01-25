import { Schema, model, Types } from "mongoose";
import type { cartItems, GiftItems } from "../../types/dto/v1/order.dto"
import mongoosePaginate from "mongoose-paginate-v2";
import type { PaginateModel } from "mongoose";
import type { PaymentMethod } from "../../types/dto/v1/payment-transaction.dto"
import { VoucherUsageOrderSchema } from "./voucher-usage.entity";
import type { VoucherUsageOrder } from "./voucher-usage.entity";
import { VariantCombinationSchema } from "./product.entity";
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

export interface ShippingProvider {
  _id: Types.ObjectId
  code: string           // ghtk, ghn, vtpost...
  name: string           // Giao Hàng Tiết Kiệm
  logo?: string
  hotline?: string
  trackingUrl?: string   // https://i.ghtk.vn/{trackingCode}
  isActive: boolean
}

export interface OrderShipping {
  _id: Types.ObjectId
  orderId: Types.ObjectId
  providerId: Types.ObjectId

  trackingCode?: string
  shippingFee: number

  status: string          // pending | picked | shipping | delivered | returned
  statusText?: string     // Đang giao hàng

  shippedAt?: Date
  deliveredAt?: Date

  logs: {
    status: string
    description: string
    time: Date
  }[],

  createdAt?: Date;
  updatedAt?: Date;
}

export interface Payment {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  method: PaymentMethod;
}

export interface OrderStatus {
  _id: Types.ObjectId;
  name: string;
  status: string;
  icon?: string;
  index: number;
}

export interface Order {
  _id: Types.ObjectId;
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
  note?: string;
  paymentId: Types.ObjectId;
  cartItems: cartItems[];
  giftItems?: GiftItems[];
  promotionGiftApplied: boolean;
  stockDeducted: boolean;
  totalPrice: number;
  totalPriceSave: number;
  totalPriceCurrent: number;
  totalDiscountOrder: number;
  shippingFee: number;
  shipping?: Types.ObjectId
  status: Types.ObjectId;
  userId?: Types.ObjectId | null;
  cancelRequested: boolean;
  transaction?: Types.ObjectId;
  reward: {
    points: number;
    awarded: boolean;
    awardedAt: Date | null;
  };
  usedPoints: number;
  pointsRefunded: boolean;
  membershipDiscountRate: number;
  membershipDiscountAmount: number;
  voucherUsage: VoucherUsageOrder[];
  voucherRefunded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ShippingProviderSchema = new Schema<ShippingProvider>(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    logo: { type: String },
    hotline: { type: String },
    trackingUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const OrderShippingSchema = new Schema<OrderShipping>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "ShippingProvider",
      required: true,
    },

    trackingCode: { type: String },
    shippingFee: { type: Number, default: 0 },

    status: { type: String, default: "pending" },
    statusText: { type: String },

    shippedAt: { type: Date },
    deliveredAt: { type: Date },

    logs: [
      {
        status: String,
        description: String,
        time: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true
  }
)

const CartItemsSchema = new Schema<cartItems>(
  {
    idProduct: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    note: { type: String },
    sku: { type: String },
    combinationId: { type: String },
    variantCombination: { type: VariantCombinationSchema },
  },
  { _id: false }
);

const GiftItemsSchema = new Schema<GiftItems>(
  {
    promotionGiftId: { type: Schema.Types.ObjectId as any, ref: "PromotionGift", required: true, index: true },
    idProduct: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    sku: { type: String },
    combinationId: { type: String },
    variantCombination: { type: VariantCombinationSchema },
  },
  { _id: false }
);

const PaymentSchema = new Schema<Payment>(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    method: { type: String },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const OrderStatusSchema = new Schema<OrderStatus>(
  {
    name: { type: String, required: true },
    status: { type: String, required: true },
    icon: { type: String },
    index: { type: Number }
  },
  { timestamps: true }
);

const OrderSchema = new Schema<Order>(
  {
    code: { type: String, required: true },
    time: { type: String, required: true },
    address: { type: String, required: true },
    provinceCode: { type: Number, required: true },
    districtCode: { type: Number, required: true },
    wardCode: { type: Number, required: true },
    provinceName: { type: String, required: true },
    districtName: { type: String, required: true },
    wardName: { type: String, required: true },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    note: { type: String },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment", required: true },
    cartItems: { type: [CartItemsSchema], required: true },
    giftItems: { type: [GiftItemsSchema], default: [],},
    promotionGiftApplied: {type: Boolean, default: false },
    stockDeducted: {type: Boolean, default: false },
    totalPrice: { type: Number, required: true },
    totalPriceSave: { type: Number, required: true },
    totalPriceCurrent: { type: Number, required: true },
    totalDiscountOrder: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    shipping: { type: Schema.Types.ObjectId, ref: "OrderShipping"},
    status: { type: Schema.Types.ObjectId, ref: "OrderStatus", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    // transaction: { type: Schema.Types.ObjectId, ref: "PaymentTransaction" },
    cancelRequested: { type: Boolean, default: false },
    reward: {
      points: { type: Number, default: 0 },
      awarded: { type: Boolean, default: false },
      awardedAt: { type: Date, default: null },
    },
    usedPoints: { type: Number, default: 0 },
    pointsRefunded: { type: Boolean, default: false },
    membershipDiscountRate: { type: Number, default: 0 },
    membershipDiscountAmount: { type: Number, default: 0 },
    voucherUsage: [VoucherUsageOrderSchema],
    voucherRefunded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

OrderSchema.virtual("transaction", {
  ref: "PaymentTransaction",
  localField: "_id",       // Order._id
  foreignField: "orderId", // PaymentTransaction.orderId
  justOne: true,           // 1 order = 1 payment
});


OrderSchema.plugin(mongoosePaginate);

OrderSchema.set("toObject", { virtuals: true });
OrderSchema.set("toJSON", { virtuals: true });

export const ShippingProviderEntity = model("ShippingProvider", ShippingProviderSchema, "shipping_providers");
export const OrderShippingEntity = model("OrderShipping", OrderShippingSchema, "order_shippings")
export const PaymentEntity = model("Payment", PaymentSchema, "payments");
export const OrderStatusEntity = model("OrderStatus", OrderStatusSchema, "order_status");
export const OrderEntity = model<Order, PaginateModel<Order>>("Order", OrderSchema, "orders");