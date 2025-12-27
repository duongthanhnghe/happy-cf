import { Types } from "mongoose";
import { toPaymentTransactionDTO } from "./payment-transaction.mapper.js";
export function toShippingProviderDTO(entity) {
    var _a;
    return {
        id: ((_a = entity._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
        name: entity.name,
        code: entity.code,
        logo: entity.logo || "",
    };
}
export const toShippingProviderListDTO = (list) => list.map(toShippingProviderDTO);
export function toOrderShippingDTO(entity) {
    var _a, _b, _c;
    const allowedStatus = [
        'pending', 'picked', 'shipping', 'delivered', 'returned', 'cancelled'
    ];
    const provider = entity.providerId && typeof entity.providerId === 'object'
        ? toShippingProviderDTO(entity.providerId)
        : null;
    return {
        id: ((_a = entity._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
        provider,
        trackingCode: (_b = entity.trackingCode) !== null && _b !== void 0 ? _b : null,
        status: allowedStatus.includes(entity.status)
            ? entity.status
            : 'pending',
        shippingFee: (_c = entity.shippingFee) !== null && _c !== void 0 ? _c : 0,
        shippedAt: entity.shippedAt
            ? new Date(entity.shippedAt).toISOString()
            : null,
        deliveredAt: entity.deliveredAt
            ? new Date(entity.deliveredAt).toISOString()
            : null,
        logs: (entity.logs || []).map(log => ({
            status: allowedStatus.includes(log.status)
                ? log.status
                : 'pending',
            description: log.description,
            time: new Date(log.time).toISOString()
        }))
    };
}
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
        provinceName: entity.provinceName,
        districtName: entity.districtName,
        wardName: entity.wardName,
        phone: entity.phone,
        note: entity.note || "",
        paymentId: toPaymentDTO(entity.paymentId),
        cartItems: Array.isArray(entity.cartItems)
            ? entity.cartItems.map(toCartItemDTO)
            : [],
        stockDeducted: entity.stockDeducted,
        totalPrice: entity.totalPrice,
        totalPriceSave: entity.totalPriceSave,
        totalPriceCurrent: entity.totalPriceCurrent,
        totalDiscountOrder: entity.totalDiscountOrder,
        shippingFee: entity.shippingFee,
        shipping: entity.shipping
            ? toOrderShippingDTO(entity.shipping)
            : null,
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
export function toOrderExport(entity) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
    const shipping = entity.shipping;
    const transaction = entity.transaction;
    const status = entity.status;
    const payment = entity.paymentId;
    const user = entity.userId;
    return {
        orderId: (_a = entity._id) === null || _a === void 0 ? void 0 : _a.toString(),
        code: entity.code,
        time: entity.time,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        fullname: entity.fullname,
        phone: entity.phone,
        address: entity.address,
        provinceName: entity.provinceName,
        districtName: entity.districtName,
        wardName: entity.wardName,
        note: (_b = entity.note) !== null && _b !== void 0 ? _b : "",
        totalPrice: entity.totalPrice,
        totalPriceSave: entity.totalPriceSave,
        totalPriceCurrent: entity.totalPriceCurrent,
        totalDiscountOrder: entity.totalDiscountOrder,
        shippingFee: entity.shippingFee,
        orderStatusCode: (_c = status === null || status === void 0 ? void 0 : status.status) !== null && _c !== void 0 ? _c : "",
        orderStatusName: (_d = status === null || status === void 0 ? void 0 : status.name) !== null && _d !== void 0 ? _d : "",
        paymentMethod: (_e = payment === null || payment === void 0 ? void 0 : payment.method) !== null && _e !== void 0 ? _e : "",
        paymentName: (_f = payment === null || payment === void 0 ? void 0 : payment.name) !== null && _f !== void 0 ? _f : "",
        transactionCode: (_g = transaction === null || transaction === void 0 ? void 0 : transaction.code) !== null && _g !== void 0 ? _g : "",
        transactionStatus: (_h = transaction === null || transaction === void 0 ? void 0 : transaction.status) !== null && _h !== void 0 ? _h : "",
        transactionAmount: (_j = transaction === null || transaction === void 0 ? void 0 : transaction.amount) !== null && _j !== void 0 ? _j : 0,
        shippingStatus: (_k = shipping === null || shipping === void 0 ? void 0 : shipping.status) !== null && _k !== void 0 ? _k : "",
        shippingStatusText: (_l = shipping === null || shipping === void 0 ? void 0 : shipping.statusText) !== null && _l !== void 0 ? _l : "",
        shippingProvider: (_o = (_m = shipping === null || shipping === void 0 ? void 0 : shipping.providerId) === null || _m === void 0 ? void 0 : _m.name) !== null && _o !== void 0 ? _o : "",
        shippingTrackingCode: (_p = shipping === null || shipping === void 0 ? void 0 : shipping.trackingCode) !== null && _p !== void 0 ? _p : "",
        shippedAt: (_q = shipping === null || shipping === void 0 ? void 0 : shipping.shippedAt) !== null && _q !== void 0 ? _q : "",
        deliveredAt: (_r = shipping === null || shipping === void 0 ? void 0 : shipping.deliveredAt) !== null && _r !== void 0 ? _r : "",
        userId: (_t = (_s = user === null || user === void 0 ? void 0 : user._id) === null || _s === void 0 ? void 0 : _s.toString()) !== null && _t !== void 0 ? _t : "",
        userEmail: (_u = user === null || user === void 0 ? void 0 : user.email) !== null && _u !== void 0 ? _u : "",
        userPhone: (_v = user === null || user === void 0 ? void 0 : user.phone) !== null && _v !== void 0 ? _v : "",
        usedPoints: (_w = entity.usedPoints) !== null && _w !== void 0 ? _w : 0,
        rewardPoints: (_y = (_x = entity.reward) === null || _x === void 0 ? void 0 : _x.points) !== null && _y !== void 0 ? _y : 0,
        rewardAwarded: (_0 = (_z = entity.reward) === null || _z === void 0 ? void 0 : _z.awarded) !== null && _0 !== void 0 ? _0 : false,
        rewardAwardedAt: (_2 = (_1 = entity.reward) === null || _1 === void 0 ? void 0 : _1.awardedAt) !== null && _2 !== void 0 ? _2 : "",
        stockDeducted: entity.stockDeducted,
        cancelRequested: entity.cancelRequested,
        voucherRefunded: entity.voucherRefunded,
        pointsRefunded: entity.pointsRefunded,
        cartItems: Array.isArray(entity.cartItems)
            ? entity.cartItems
                .map((i) => { var _a; return `${(_a = i.idProduct) === null || _a === void 0 ? void 0 : _a.productName} x${i.quantity}`; })
                .join(" | ")
            : "",
        voucherCodes: Array.isArray(entity.voucherUsage)
            ? entity.voucherUsage.map((v) => v.code).join(", ")
            : "",
    };
}
function toCartItemDTO(entity) {
    let idProduct = entity.idProduct;
    if (typeof idProduct === "string") {
        idProduct = new Types.ObjectId(idProduct);
    }
    else if (idProduct instanceof Types.ObjectId) {
    }
    else if (typeof idProduct === "object" && idProduct !== null) {
        // giữ nguyên object
    }
    else {
        idProduct = new Types.ObjectId();
    }
    return {
        idProduct,
        price: entity.price,
        quantity: entity.quantity,
        note: entity.note || "",
        sku: entity.sku,
        variantCombination: entity.variantCombination,
        combinationId: entity.combinationId || "",
    };
}
//# sourceMappingURL=order.mapper.js.map