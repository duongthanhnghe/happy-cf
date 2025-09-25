import { Types } from "mongoose";
import { toPaymentTransactionDTO } from "../mappers/paymentTransactionMapper.js";
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
        phone: entity.phone,
        note: entity.note || "",
        paymentId: toPaymentDTO(entity.paymentId),
        cartItems: Array.isArray(entity.cartItems)
            ? entity.cartItems.map(toCartItemDTO)
            : [],
        totalPrice: entity.totalPrice,
        totalPriceSave: entity.totalPriceSave,
        totalPriceCurrent: entity.totalPriceCurrent,
        status: toOrderStatusDTO(entity.status),
        userId: entity.userId
            ? entity.userId._id
                ? entity.userId._id.toString()
                : entity.userId.toString()
            : null,
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
        createdAt: ((_d = entity.createdAt) === null || _d === void 0 ? void 0 : _d.toISOString()) || "",
        updatedAt: ((_e = entity.updatedAt) === null || _e === void 0 ? void 0 : _e.toISOString()) || "",
    };
}
export const toOrderListDTO = (orders) => orders.map(toOrderDTO);
function toCartItemDTO(entity) {
    return {
        idProduct: entity.idProduct
            ? new Types.ObjectId(entity.idProduct)
            : new Types.ObjectId(),
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
//# sourceMappingURL=orderMapper.js.map