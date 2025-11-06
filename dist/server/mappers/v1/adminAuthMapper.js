export function toAdminAccountDTO(entity) {
    var _a, _b, _c;
    return {
        id: entity._id.toString(),
        avatar: entity.avatar,
        fullname: entity.fullname,
        email: entity.email,
        role: entity.role,
        active: entity.active,
        lastLogin: (_a = entity.lastLogin) === null || _a === void 0 ? void 0 : _a.toISOString(),
        createdAt: (_b = entity.createdAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
        updatedAt: (_c = entity.updatedAt) === null || _c === void 0 ? void 0 : _c.toISOString(),
    };
}
export const toAdminAccountListDTO = (admins) => {
    return admins.map(toAdminAccountDTO);
};
//# sourceMappingURL=adminAuthMapper.js.map