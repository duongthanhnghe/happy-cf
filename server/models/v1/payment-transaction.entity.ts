import mongoose,{ Schema, model, Document, Types } from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import type { PaymentMethod } from "../../types/dto/v1/payment-transaction.dto"
import { PAYMENT_TRANSACTION_STATUS } from "../../shared/constants/payment-transaction-status";
import type { PaymentTransactionStatus } from "../../shared/constants/payment-transaction-status";

export interface PaymentTransactionDocument extends Document {
  orderId: Types.ObjectId
  txnRef: string
  amount: number
  method: PaymentMethod
  status: PaymentTransactionStatus
  vnpTransactionNo?: string;         // VNPay transaction id
  paidAt?: Date;                     // thời điểm thanh toán
  rawIpn?: Record<string, any>;      // log IPN
  createdAt: Date
  updatedAt: Date
}

const PaymentTransactionSchema = new Schema<PaymentTransactionDocument>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    txnRef: {
      type: String,
      required: true,
      unique: true,                
      index: true,
    },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["cash", "bank_transfer","momo","vnpay"], required: true },
    status: {
      type: String,
      enum: Object.values(PAYMENT_TRANSACTION_STATUS),
      default: PAYMENT_TRANSACTION_STATUS.PENDING,
    },
    vnpTransactionNo: {
      type: String,
    },

    paidAt: {
      type: Date,
    },

    rawIpn: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
)

PaymentTransactionSchema.plugin(mongoosePaginate)

export const PaymentTransactionEntity = model<
  PaymentTransactionDocument,
  mongoose.PaginateModel<PaymentTransactionDocument>
>("PaymentTransaction", PaymentTransactionSchema)
