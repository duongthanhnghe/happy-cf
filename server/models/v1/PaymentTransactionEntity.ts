import mongoose,{ Schema, model, Document, Types } from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import type { PaymentMethod } from "../../types/dto/v1/payment-transaction.dto"
import { PAYMENT_TRANSACTION_STATUS } from "../../shared/constants/payment-transaction-status";
import type { PaymentTransactionStatus } from "../../shared/constants/payment-transaction-status";


export interface PaymentTransactionDocument extends Document {
  orderId: Types.ObjectId
  amount: number
  method: PaymentMethod
  status: PaymentTransactionStatus
  createdAt: Date
  updatedAt: Date
}

const PaymentTransactionSchema = new Schema<PaymentTransactionDocument>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["cash", "bank_transfer"], required: true },
    status: {
      type: String,
      enum: Object.values(PAYMENT_TRANSACTION_STATUS),
      default: PAYMENT_TRANSACTION_STATUS.PENDING,
    }
  },
  { timestamps: true }
)

PaymentTransactionSchema.plugin(mongoosePaginate)

export const PaymentTransactionEntity = model<
  PaymentTransactionDocument,
  mongoose.PaginateModel<PaymentTransactionDocument>
>("PaymentTransaction", PaymentTransactionSchema)
