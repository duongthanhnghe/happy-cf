import type { ProductReviewDTO } from "../../types/dto/v1/product-review.dto";
import { ProductReviewStatusText, ProductReviewStatusColor } from "../../types/dto/v1/product-review.dto";
import type { ProductReview } from "../../models/v1/ProductReviewEntity";
import { toProductDTO } from "../../mappers/v1/productMapper"
import type { Product } from "../../models/v1/ProductEntity"
import { toUserDTO } from "./userMapper";
import type { User } from "../../models/v1/UserEntity";

export function toProductReviewDTO(entity: ProductReview): ProductReviewDTO {
  return {
    id: entity._id.toString(),
    orderId: entity.orderId?.toString?.() || "",

    userId:
      entity.userId &&
      typeof entity.userId === "object" &&
      "fullname" in (entity.userId as any)
        ? toUserDTO(entity.userId as unknown as User)
        : entity.userId?.toString?.() || "",

    productId:
      entity.productId &&
      typeof entity.productId === "object" &&
      "productName" in (entity.productId as any)
        ? toProductDTO(entity.productId as Product)
        : entity.productId?.toString?.() || "",

    rating: entity.rating,
    comment: entity.comment || null,
    images: entity.images || [],
    status: entity.status,
    statusText: ProductReviewStatusText[entity.status],
    statusColor: ProductReviewStatusColor[entity.status],
    createdAt: entity.createdAt?.toISOString?.() || "",
    updatedAt: entity.updatedAt?.toISOString?.() || "",
  };
}

export const toProductReviewListDTO = (entities: ProductReview[]): ProductReviewDTO[] =>
  entities.map(toProductReviewDTO);