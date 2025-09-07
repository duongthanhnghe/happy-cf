import { Schema, model } from "mongoose";
const SelectedOptionsPushSchema = new Schema({
    optionName: { type: String, required: true },
    variantName: { type: String, required: true },
    variantPrice: { type: Number, required: true }
}, { _id: false });
const CartItemsSchema = new Schema({
    idProduct: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    priceDiscounts: { type: Number, required: true },
    quantity: { type: Number, required: true },
    note: { type: String },
    selectedOptionsPush: { type: [SelectedOptionsPushSchema], default: [] },
    finalPriceDiscounts: { type: Number, required: true }
}, { _id: false });
const PaymentSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String }
}, { timestamps: true });
const OrderStatusSchema = new Schema({
    name: { type: String, required: true },
    status: { type: String, required: true },
    icon: { type: String }
}, { timestamps: true });
const OrderSchema = new Schema({
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
    status: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null }
}, { timestamps: true });
export const PaymentModel = model("Payment", PaymentSchema, "payments");
export const OrderStatusModel = model("OrderStatus", OrderStatusSchema, 'order_status');
export const OrderModel = model("Order", OrderSchema, 'orders');
//# sourceMappingURL=OrderModel.js.map