import { Types } from "mongoose";
import { toPaymentTransactionDTO } from "./payment-transaction.mapper.js";
export function toPaymentDTO(entity) {
    var _a;
    return {
        id: ((_a = entity._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
        name: entity.name,
        description: entity.description || "",
        image: entity.image || "",
        method: entity.method || null,
    };
}
export const toPaymentListDTO = (payments) => payments.map(toPaymentDTO);
export function toOrderStatusDTO(entity) {
    var _a;
    return {
        id: ((_a = entity._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
        name: entity.name,
        status: entity.status,
        icon: entity.icon || "",
        index: entity.index,
    };
}
export const toOrderStatusListDTO = (list) => list.map(toOrderStatusDTO);
export function toOrderDTO(entity) {
    var _a, _b, _c, _d, _e;
    return {
        id: ((_a = entity._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
        code: entity.code,
        time: entity.time,
        address: entity.address,
        fullname: entity.fullname,
        provinceCode: entity.provinceCode,
        districtCode: entity.districtCode,
        wardCode: entity.wardCode,
        phone: entity.phone,
        note: entity.note || "",
        paymentId: toPaymentDTO(entity.paymentId),
        cartItems: Array.isArray(entity.cartItems)
            ? entity.cartItems.map(toCartItemDTO)
            : [],
        totalPrice: entity.totalPrice,
        totalPriceSave: entity.totalPriceSave,
        totalPriceCurrent: entity.totalPriceCurrent,
        totalDiscountOrder: entity.totalDiscountOrder,
        shippingFee: entity.shippingFee,
        status: toOrderStatusDTO(entity.status),
        userId: entity.userId
            ? entity.userId._id
                ? entity.userId._id.toString()
                : entity.userId.toString()
            : null,
        cancelRequested: entity.cancelRequested,
        transaction: entity.transaction ? toPaymentTransactionDTO(entity.transaction) : null,
        reward: entity.reward
            ? {
                points: (_b = entity.reward.points) !== null && _b !== void 0 ? _b : 0,
                awarded: (_c = entity.reward.awarded) !== null && _c !== void 0 ? _c : false,
                awardedAt: entity.reward.awardedAt
                    ? new Date(entity.reward.awardedAt).toISOString()
                    : null,
            }
            : {
                points: 0,
                awarded: false,
                awardedAt: null,
            },
        usedPoints: entity.usedPoints,
        pointsRefunded: entity.pointsRefunded,
        membershipDiscountRate: entity.membershipDiscountRate,
        membershipDiscountAmount: entity.membershipDiscountAmount,
        createdAt: ((_d = entity.createdAt) === null || _d === void 0 ? void 0 : _d.toISOString()) || "",
        updatedAt: ((_e = entity.updatedAt) === null || _e === void 0 ? void 0 : _e.toISOString()) || "",
        voucherRefunded: entity.voucherRefunded,
        voucherUsage: Array.isArray(entity.voucherUsage)
            ? entity.voucherUsage.map(v => {
                var _a, _b;
                return ({
                    code: v.code,
                    type: v.type,
                    discount: (_a = v.discount) !== null && _a !== void 0 ? _a : 0,
                    expiresAt: v.expiresAt ? new Date(v.expiresAt).toISOString() : undefined,
                    stackable: (_b = v.stackable) !== null && _b !== void 0 ? _b : false,
                    applicableProducts: Array.isArray(v.applicableProducts)
                        ? v.applicableProducts.map(p => {
                            var _a, _b;
                            return ({
                                productId: p.productId ? p.productId.toString() : "",
                                name: p.name,
                                categoryId: p.categoryId ? p.categoryId.toString() : "",
                                price: (_a = p.price) !== null && _a !== void 0 ? _a : 0,
                                quantity: (_b = p.quantity) !== null && _b !== void 0 ? _b : 0,
                            });
                        })
                        : [],
                });
            })
            : []
    };
}
export const toOrderListDTO = (orders) => orders.map(toOrderDTO);
function toCartItemDTO(entity) {
    let idProduct = entity.idProduct;
    // Nếu là string → convert sang objectId
    if (typeof idProduct === "string") {
        idProduct = new Types.ObjectId(idProduct);
    }
    // Nếu là ObjectId → giữ nguyên
    else if (idProduct instanceof Types.ObjectId) {
        // ok giữ nguyên
    }
    // Nếu là object → ProductDTO
    else if (typeof idProduct === "object" && idProduct !== null) {
        // giữ nguyên object
    }
    else {
        idProduct = new Types.ObjectId();
    }
    return {
        idProduct,
        priceDiscounts: entity.priceDiscounts,
        quantity: entity.quantity,
        note: entity.note || "",
        selectedOptionsPush: Array.isArray(entity.selectedOptionsPush)
            ? entity.selectedOptionsPush.map(toSelectedOptionDTO)
            : [],
        finalPriceDiscounts: entity.finalPriceDiscounts,
    };
}
function toSelectedOptionDTO(entity) {
    return {
        optionName: entity.optionName,
        variantName: entity.variantName,
        variantPrice: entity.variantPrice,
    };
}
//# sourceMappingURL=order.mapper.js.map