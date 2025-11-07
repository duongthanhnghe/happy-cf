import { ProductReviewStatusText, ProductReviewStatusColor } from "../../types/dto/v1/product-review.dto.js";
import { toProductDTO } from "./product.mapper.js";
import { toUserDTO } from "./user.mapper.js";
export function toProductReviewDTO(entity) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return {
        id: entity._id.toString(),
        orderId: ((_b = (_a = entity.orderId) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a)) || "",
        userId: entity.userId &&
            typeof entity.userId === "object" &&
            "fullname" in entity.userId
            ? toUserDTO(entity.userId)
            : ((_d = (_c = entity.userId) === null || _c === void 0 ? void 0 : _c.toString) === null || _d === void 0 ? void 0 : _d.call(_c)) || "",
        productId: entity.productId &&
            typeof entity.productId === "object" &&
            "productName" in entity.productId
            ? toProductDTO(entity.productId)
            : ((_f = (_e = entity.productId) === null || _e === void 0 ? void 0 : _e.toString) === null || _f === void 0 ? void 0 : _f.call(_e)) || "",
        rating: entity.rating,
        comment: entity.comment || null,
        images: entity.images || [],
        status: entity.status,
        statusText: ProductReviewStatusText[entity.status],
        statusColor: ProductReviewStatusColor[entity.status],
        createdAt: ((_h = (_g = entity.createdAt) === null || _g === void 0 ? void 0 : _g.toISOString) === null || _h === void 0 ? void 0 : _h.call(_g)) || "",
        updatedAt: ((_k = (_j = entity.updatedAt) === null || _j === void 0 ? void 0 : _j.toISOString) === null || _k === void 0 ? void 0 : _k.call(_j)) || "",
    };
}
export const toProductReviewListDTO = (entities) => entities.map(toProductReviewDTO);
//# sourceMappingURL=product-review.mapper.js.map