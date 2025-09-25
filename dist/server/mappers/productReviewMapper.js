import { ProductReviewStatusText, ProductReviewStatusColor } from "../types/dto/product-review.dto.js";
import { toProductDTO } from "../mappers/productMapper.js";
import { toUserDTO } from "./userMapper.js";
export function toProductReviewDTO(entity) {
    return {
        id: entity._id.toString(),
        orderId: entity.orderId.toString(),
        userId: typeof entity.userId === "object" && "fullname" in entity.userId
            ? toUserDTO(entity.userId)
            : entity.userId.toString(),
        productId: typeof entity.productId === "object" && "productName" in entity.productId
            ? toProductDTO(entity.productId)
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
export const toProductReviewListDTO = (entities) => entities.map(toProductReviewDTO);
//# sourceMappingURL=productReviewMapper.js.map