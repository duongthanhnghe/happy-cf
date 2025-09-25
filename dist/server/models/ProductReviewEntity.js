import { Schema, model } from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";
import { PRODUCT_REVIEW_STATUS } from '../types/dto/product-review.dto.js';
const ProductReviewSchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String, default: '' },
    images: { type: [String], default: [] },
    status: { type: String, enum: Object.values(PRODUCT_REVIEW_STATUS), default: PRODUCT_REVIEW_STATUS.PENDING },
}, { timestamps: true });
ProductReviewSchema.plugin(mongoosePaginate);
export const ProductReviewEntity = model("ProductReview", ProductReviewSchema, "product_reviews");
//# sourceMappingURL=ProductReviewEntity.js.map