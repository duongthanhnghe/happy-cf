export function toVoucherDTO(entity) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    return {
        id: entity._id.toString(),
        code: entity.code,
        name: entity.name,
        description: entity.description,
        type: entity.type,
        value: entity.value,
        maxDiscount: entity.maxDiscount,
        minOrderValue: (_a = entity.minOrderValue) !== null && _a !== void 0 ? _a : 0,
        maxShippingDiscount: (_b = entity.maxShippingDiscount) !== null && _b !== void 0 ? _b : undefined,
        usageLimit: (_c = entity.usageLimit) !== null && _c !== void 0 ? _c : 0,
        usedCount: (_d = entity.usedCount) !== null && _d !== void 0 ? _d : 0,
        limitPerUser: (_e = entity.limitPerUser) !== null && _e !== void 0 ? _e : 0,
        startDate: (_f = entity.startDate) === null || _f === void 0 ? void 0 : _f.toISOString(),
        endDate: (_g = entity.endDate) === null || _g === void 0 ? void 0 : _g.toISOString(),
        applicableProducts: (_j = (_h = entity.applicableProducts) === null || _h === void 0 ? void 0 : _h.map((p) => p.toString())) !== null && _j !== void 0 ? _j : [],
        applicableCategories: (_l = (_k = entity.applicableCategories) === null || _k === void 0 ? void 0 : _k.map((c) => c.toString())) !== null && _l !== void 0 ? _l : [],
        stackable: (_m = entity.stackable) !== null && _m !== void 0 ? _m : false,
        isActive: (_o = entity.isActive) !== null && _o !== void 0 ? _o : true,
        usedBy: (_q = (_p = entity.usedBy) === null || _p === void 0 ? void 0 : _p.map(toUsedBy)) !== null && _q !== void 0 ? _q : [],
        createdAt: ((_r = entity.createdAt) === null || _r === void 0 ? void 0 : _r.toISOString()) || "",
    };
}
export function toUsedBy(entity) {
    return {
        userId: entity.userId,
        count: entity.count,
    };
}
export const toVoucherListDTO = (vouchers) => {
    return vouchers.map(toVoucherDTO);
};
//# sourceMappingURL=voucherMapper.js.map