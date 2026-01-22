import { Schema, model, Document, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import type { PaginateModel } from "mongoose";
import { VOUCHER_TYPE, VOUCHER_TYPE_LIST } from '../../shared/constants/voucher-type'

export interface Voucher {
  _id: Types.ObjectId | string;
  code: string;                 // Mã voucher (VD: COOL10)
  name: string;                 // Tên voucher hiển thị
  description?: string;         // Mô tả (tùy chọn)
  image?: string; 

  type: VOUCHER_TYPE;
  value: number;                // Giá trị giảm (% hoặc số tiền)
  maxDiscount?: number;         // Giới hạn giảm tối đa (nếu type = percentage)
  minOrderValue: number;        // Đơn tối thiểu được áp dụng

  maxShippingDiscount?: number; // Nếu là freeship

  usageLimit: number;           // Tổng số lượt dùng tối đa (0 = không giới hạn)
  usedCount: number;            // Số lượt đã dùng
  limitPerUser: number;         // Giới hạn mỗi user (0 = không giới hạn)

  usedBy: {
    userId: Types.ObjectId;
    count: number;
  }[];

  startDate: Date;
  endDate: Date;

  applicableProducts?: (Types.ObjectId | string)[];
  applicableCategories?: (Types.ObjectId | string)[];

  stackable: boolean;           // Có cộng dồn được không
  isActive: boolean;            // Còn hiệu lực không

  createdAt?: Date;
  updatedAt?: Date;
}

export interface VoucherUsage extends Document {
  _id: Types.ObjectId;
  voucherId: Types.ObjectId;
  userId: Types.ObjectId;
  orderId?: Types.ObjectId | null;

  code: string;
  type: VOUCHER_TYPE;
  discount: number;

  applicableProducts?: {
    productId: Types.ObjectId;
    name: string;
    categoryId?: Types.ObjectId;
    price: number;
    quantity: number;
  }[];

  expiresAt?: Date | null;
  stackable: boolean;

  usedAt: Date;
  reverted: boolean;
  revertedAt?: Date | null;

  meta?: {
    ip?: string;
    userAgent?: string;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

const VoucherSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },

    type: {
      type: String,
      required: true,
      enum: VOUCHER_TYPE_LIST,
    },

    value: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    minOrderValue: { type: Number, default: 0 },

    maxShippingDiscount: { type: Number },

    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    limitPerUser: { type: Number, default: 0 },

     usedBy: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        count: { type: Number, default: 0 },
      },
    ],

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    applicableProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: "CategoryProduct" }],

    stackable: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

VoucherSchema.plugin(mongoosePaginate);

export const VoucherEntity = model<Voucher, PaginateModel<Voucher>>("Voucher", VoucherSchema, "vouchers");

