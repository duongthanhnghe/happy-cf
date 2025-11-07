import type { ProductReviewDTO } from "../../types/dto/v1/product-review.dto";
import { ProductReviewStatusText, ProductReviewStatusColor } from "../../types/dto/v1/product-review.dto";
import type { ProductReview } from "../../models/v1/product-review.entity";
import { toProductDTO } from "./product.mapper"
import type { Product } from "../../models/v1/product.entity"
import { toUserDTO } from "./user.mapper";
import type { User } from "../../models/v1/user.entity";

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