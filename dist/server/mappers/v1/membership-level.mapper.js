import { toMembershipBenefitListDTO } from "./membership-benefit.mapper.js";
export function toMembershipLevelDTO(entity) {
    return {
        id: entity._id.toString(),
        name: entity.name,
        minPoint: entity.minPoint,
        icon: entity.icon,
        image: entity.image,
        discountRate: entity.discountRate,
        pointRate: entity.pointRate,
        benefits: Array.isArray(entity.benefits)
            ? toMembershipBenefitListDTO(entity.benefits)
            : [],
    };
}
export const toMembershipLevelListDTO = (items) => {
    return items.map(toMembershipLevelDTO);
};
//# sourceMappingURL=membership-level.mapper.js.map