import type { ProductReviewDTO } from "../types/dto/product-review.dto";
import { ProductReviewStatusText, ProductReviewStatusColor } from "../types/dto/product-review.dto";
import type { ProductReview } from "../models/ProductReviewEntity";
import { toProductDTO } from "../mappers/productMapper"
import type { Product } from "../models/ProductEntity"
import { toUserDTO } from "./userMapper";
import type { User } from "../models/UserEntity";

export function toProductReviewDTO(entity: ProductReview): ProductReviewDTO {
  return {
    id: entity._id.toString(),
    orderId: entity.orderId.toString(),
    userId:
      typeof entity.userId === "object" && "fullname" in entity.userId
        ? toUserDTO(entity.userId as unknown as User)
        : entity.userId.toString(),
    productId:
      typeof entity.productId === "object" && "productName" in entity.productId
        ? toProductDTO(entity.productId as Product)
        : entity.productId.toString(),
    rating: entity.rating,
    comment: entity.comment || null,
    images: entity.images || [],
    status: entity.status,
    statusText: ProductReviewStatusText[entity.status],
    statusColor: ProductReviewStatusColor[entity.status],
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export const toProductReviewListDTO = (entities: ProductReview[]): ProductReviewDTO[] =>
  entities.map(toProductReviewDTO);