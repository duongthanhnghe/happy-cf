import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { VoucherUsageOrderSchema } from "./VoucherUsageEntity.js";
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
    finalPriceDiscounts: { type: Number }
}, { _id: false });
const PaymentSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    method: { type: String },
}, { timestamps: true });
const OrderStatusSchema = new Schema({
    name: { type: String, required: true },
    status: { type: String, required: true },
    icon: { type: String },
    index: { type: Number }
}, { timestamps: true });
const OrderSchema = new Schema({
    code: { type: String, required: true },
    time: { type: String, required: true },
    address: { type: String, required: true },
    provinceCode: { type: Number, required: true },
    districtCode: { type: Number, required: true },
    wardCode: { type: Number, required: true },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    note: { type: String },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment", required: true },
    cartItems: { type: [CartItemsSchema], required: true },
    totalPrice: { type: Number, required: true },
    totalPriceSave: { type: Number, required: true },
    totalPriceCurrent: { type: Number, required: true },
    totalDiscountOrder: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    status: { type: Schema.Types.ObjectId, ref: "OrderStatus", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    transaction: { type: Schema.Types.ObjectId, ref: "PaymentTransaction" },
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
}, { timestamps: true });
OrderSchema.plugin(mongoosePaginate);
export const PaymentEntity = model("Payment", PaymentSchema, "payments");
export const OrderStatusEntity = model("OrderStatus", OrderStatusSchema, "order_status");
export const OrderEntity = model("Order", OrderSchema, "orders");
//# sourceMappingURL=OrderEntity.js.map