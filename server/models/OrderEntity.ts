import { Schema, model, Document, Types } from "mongoose";
import type { selectedOptionsPush, cartItems } from "../types/dto/order.dto"

export interface Payment {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  image?: string;
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
  fullname: string;
  phone: string;
  note?: string;
  paymentId: Types.ObjectId;
  cartItems: cartItems[];
  totalPrice: number;
  totalPriceSave: number;
  totalPriceCurrent: number;
  point?: number;
  status: Types.ObjectId;
  userId?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const SelectedOptionsPushSchema = new Schema<selectedOptionsPush>(
  {
    optionName: { type: String, required: true },
    variantName: { type: String, required: true },
    variantPrice: { type: Number, required: true }
  },
  { _id: false }
);

const CartItemsSchema = new Schema<cartItems>(
  {
    idProduct: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    priceDiscounts: { type: Number, required: true },
    quantity: { type: Number, required: true },
    note: { type: String },
    selectedOptionsPush: { type: [SelectedOptionsPushSchema], default: [] },
    finalPriceDiscounts: { type: Number }
  },
  { _id: false }
);

const PaymentSchema = new Schema<Payment>(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String }
  },
  { timestamps: true }
);

const OrderStatusSchema = new Schema<OrderStatus>(
  {
    name: { type: String, required: true },
    status: { type: String, required: true },
    icon: { type: String }
  },
  { timestamps: true }
);

const OrderSchema = new Schema<Order>(
  {
    code: { type: String, required: true },
    time: { type: String, required: true },
    address: { type: String, required: true },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    note: { type: String },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment", required: true },
    cartItems: { type: [CartItemsSchema], required: true },
    totalPrice: { type: Number, required: true },
    totalPriceSave: { type: Number, required: true },
    totalPriceCurrent: { type: Number, required: true },
    point: { type: Number, default: 0 },
    status: { type: Schema.Types.ObjectId, ref: "OrderStatus", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);


export const PaymentEntity = model("Payment", PaymentSchema, "payments");
export const OrderStatusEntity = model("OrderStatus", OrderStatusSchema, "order_status");
export const OrderEntity = model("Order", OrderSchema, "orders");
