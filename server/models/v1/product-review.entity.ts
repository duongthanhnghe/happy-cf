import { Schema, model, Types } from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";
import type { PaginateModel } from "mongoose";
import type { ReviewStatus } from '../../types/dto/v1/product-review.dto';
import { PRODUCT_REVIEW_STATUS } from '../../types/dto/v1/product-review.dto';
import type { Product } from "./product.entity"

export interface ProductReview {
  _id: Types.ObjectId;
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  productId: Types.ObjectId | Product;
  rating: number; 
  comment?: string;
  images?: string[]; 
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ProductReviewSchema = new Schema<ProductReview>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String, default: '' },
    images: { type: [String], default: [] },
    status: { type: String, enum: Object.values(PRODUCT_REVIEW_STATUS), default: PRODUCT_REVIEW_STATUS.PENDING },
  },
  { timestamps: true }
);

ProductReviewSchema.plugin(mongoosePaginate);

export const ProductReviewEntity = model<ProductReview, PaginateModel<ProductReview>>("ProductReview", ProductReviewSchema, "product_reviews");
