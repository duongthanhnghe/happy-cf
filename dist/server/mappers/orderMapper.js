import { Types } from "mongoose";
export function toPaymentDTO(entity) {
    var _a;
    return {
        id: ((_a = entity._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
        name: entity.name,
        description: entity.description || "",
        image: entity.image || "",
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
    var _a, _b, _c;
    return {
        id: ((_a = entity._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
        code: entity.code,
        time: entity.time,
        address: entity.address,
        fullname: entity.fullname,
        phone: entity.phone,
        note: entity.note || "",
        // paymentId: entity.paymentId ? entity.paymentId.toString() : "",
        paymentId: toPaymentDTO(entity.paymentId),
        cartItems: Array.isArray(entity.cartItems)
            ? entity.cartItems.map(toCartItemDTO)
            : [],
        totalPrice: entity.totalPrice,
        totalPriceSave: entity.totalPriceSave,
        totalPriceCurrent: entity.totalPriceCurrent,
        point: entity.point || 0,
        // status: entity.status ? entity.status.toString() : "",
        status: toOrderStatusDTO(entity.status),
        userId: entity.userId ? entity.userId.toString() : null,
        createdAt: ((_b = entity.createdAt) === null || _b === void 0 ? void 0 : _b.toISOString()) || "",
        updatedAt: ((_c = entity.updatedAt) === null || _c === void 0 ? void 0 : _c.toISOString()) || "",
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