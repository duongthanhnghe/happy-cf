export function toBaseInformationDTO(entity) {
    var _a, _b;
    return {
        name: entity.name,
        logoUrl: entity.logoUrl,
        phone: entity.phone,
        email: entity.email,
        address: entity.address,
        openingHours: entity.openingHours,
        socialLinks: entity.socialLinks || [],
        description: entity.description,
        provinceCode: entity.provinceCode,
        districtCode: entity.districtCode,
        wardCode: entity.wardCode,
        createdAt: (_a = entity.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
        updatedAt: (_b = entity.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
    };
}
export const toBaseInformationListDTO = (entities) => {
    return entities.map(toBaseInformationDTO);
};
//# sourceMappingURL=base-information.mapper.js.map