export function toMembershipLevelDTO(entity) {
    return {
        id: entity._id.toString(),
        name: entity.name,
        minPoint: entity.minPoint,
        icon: entity.icon,
        image: entity.image,
    };
}
export const toMembershipLevelListDTO = (items) => {
    return items.map(toMembershipLevelDTO);
};
//# sourceMappingURL=membershipLevelMapper.js.map