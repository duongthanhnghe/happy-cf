export function toUserDTO(entity) {
    var _a, _b, _c, _d, _e, _f;
    return {
        id: ((_a = entity._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
        fullname: entity.fullname,
        email: entity.email,
        gender: entity.gender || undefined,
        phone: entity.phone || "",
        birthday: ((_b = entity.birthday) === null || _b === void 0 ? void 0 : _b.toString()) || undefined,
        avatar: entity.avatar || "",
        googleId: entity.googleId,
        authProvider: entity.authProvider,
        active: entity.active,
        role: entity.role,
        membership: {
            level: entity.membership.level,
            point: entity.membership.point,
            balancePoint: entity.membership.balancePoint,
            discountRate: entity.membership.discountRate,
            pointRate: entity.membership.pointRate,
            joinedAt: (_c = entity.membership.joinedAt) === null || _c === void 0 ? void 0 : _c.toString(),
            barcode: entity.membership.barcode || "",
            code: (_d = entity.membership.code) !== null && _d !== void 0 ? _d : 0,
        },
        createdAt: ((_e = entity.createdAt) === null || _e === void 0 ? void 0 : _e.toISOString()) || "",
        updatedAt: ((_f = entity.updatedAt) === null || _f === void 0 ? void 0 : _f.toISOString()) || "",
    };
}
export const toUserListDTO = (users) => {
    return users.map(toUserDTO);
};
//# sourceMappingURL=user.mapper.js.map