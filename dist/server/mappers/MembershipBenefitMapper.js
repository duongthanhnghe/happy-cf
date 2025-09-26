export function toMembershipBenefitDTO(entity) {
    return {
        id: entity._id.toString(),
        name: entity.name,
        description: entity.description,
        icon: entity.icon,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
    };
}
export const toMembershipBenefitListDTO = (items) => {
    return items.map(toMembershipBenefitDTO);
};
//# sourceMappingURL=MembershipBenefitMapper.js.map