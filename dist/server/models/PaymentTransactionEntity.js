import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { PAYMENT_TRANSACTION_STATUS } from "../shared/constants/payment-transaction-status.js";
const PaymentTransactionSchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["cash", "bank_transfer"], required: true },
    status: {
        type: String,
        enum: Object.values(PAYMENT_TRANSACTION_STATUS),
        default: PAYMENT_TRANSACTION_STATUS.PENDING,
    }
}, { timestamps: true });
PaymentTransactionSchema.plugin(mongoosePaginate);
export const PaymentTransactionEntity = model("PaymentTransaction", PaymentTransactionSchema);
//# sourceMappingURL=PaymentTransactionEntity.js.map