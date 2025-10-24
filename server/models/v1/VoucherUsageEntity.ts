import { Schema, model, Types } from "mongoose"

const VoucherUsageSchema = new Schema(
  {
    voucherId: {
      type: Types.ObjectId,
      ref: "Voucher",
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: Types.ObjectId,
      ref: "Order",
    },
    usedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

export const VoucherUsageEntity = model("VoucherUsage", VoucherUsageSchema)
