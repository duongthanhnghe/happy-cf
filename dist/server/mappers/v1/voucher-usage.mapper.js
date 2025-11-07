export function toVoucherUsageDTO(entity) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    return {
        id: (_b = (_a = entity._id) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
        voucherId: (_d = (_c = entity.voucherId) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "",
        userId: entity.userId
            ? entity.userId._id
                ? entity.userId._id.toString()
                : entity.userId.toString()
            : null,
        orderId: (_f = (_e = entity.orderId) === null || _e === void 0 ? void 0 : _e.toString()) !== null && _f !== void 0 ? _f : "",
        code: entity.code,
        type: entity.type,
        discount: (_g = entity.discount) !== null && _g !== void 0 ? _g : 0,
        applicableProducts: (_j = (_h = entity.applicableProducts) === null || _h === void 0 ? void 0 : _h.map((p) => {
            var _a, _b, _c, _d, _e, _f, _g;
            return ({
                productId: (_b = (_a = p.productId) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
                name: (_c = p.name) !== null && _c !== void 0 ? _c : "",
                categoryId: (_e = (_d = p.categoryId) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : undefined,
                price: (_f = p.price) !== null && _f !== void 0 ? _f : 0,
                quantity: (_g = p.quantity) !== null && _g !== void 0 ? _g : 0,
            });
        })) !== null && _j !== void 0 ? _j : [],
        expiresAt: entity.expiresAt ? entity.expiresAt.toISOString() : null,
        stackable: (_k = entity.stackable) !== null && _k !== void 0 ? _k : false,
        usedAt: (_m = (_l = entity.usedAt) === null || _l === void 0 ? void 0 : _l.toISOString()) !== null && _m !== void 0 ? _m : "",
        reverted: (_o = entity.reverted) !== null && _o !== void 0 ? _o : false,
        revertedAt: entity.revertedAt ? entity.revertedAt.toISOString() : null,
        meta: {
            ip: (_q = (_p = entity.meta) === null || _p === void 0 ? void 0 : _p.ip) !== null && _q !== void 0 ? _q : "",
            userAgent: (_s = (_r = entity.meta) === null || _r === void 0 ? void 0 : _r.userAgent) !== null && _s !== void 0 ? _s : "",
        },
        createdAt: (_u = (_t = entity.createdAt) === null || _t === void 0 ? void 0 : _t.toISOString()) !== null && _u !== void 0 ? _u : "",
        updatedAt: (_w = (_v = entity.updatedAt) === null || _v === void 0 ? void 0 : _v.toISOString()) !== null && _w !== void 0 ? _w : "",
    };
}
export const toVoucherUsageListDTO = (entities) => {
    return entities.map(toVoucherUsageDTO);
};
//# sourceMappingURL=voucher-usage.mapper.js.map