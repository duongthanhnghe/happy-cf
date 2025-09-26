import { toMembershipBenefitListDTO } from "../mappers/MembershipBenefitMapper.js";
export function toMembershipLevelDTO(entity) {
    return {
        id: entity._id.toString(),
        name: entity.name,
        minPoint: entity.minPoint,
        icon: entity.icon,
        image: entity.image,
        benefits: Array.isArray(entity.benefits)
            ? toMembershipBenefitListDTO(entity.benefits)
            : [],
    };
}
export const toMembershipLevelListDTO = (items) => {
    return items.map(toMembershipLevelDTO);
};
//# sourceMappingURL=membershipLevelMapper.js.map