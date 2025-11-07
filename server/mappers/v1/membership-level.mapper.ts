import type { MembershipLevelsDocument } from "../../models/v1/membership-level.entity"
import type { MembershipLevels } from "../../types/dto/v1/user.dto"
import { toMembershipBenefitListDTO } from "./membership-benefit.mapper"

export function toMembershipLevelDTO(entity: MembershipLevelsDocument): MembershipLevels {
  return {
    id: entity._id.toString(),
    name: entity.name,
    minPoint: entity.minPoint,
    icon: entity.icon,
    image: entity.image,
    discountRate: entity.discountRate,
    pointRate: entity.pointRate,
    benefits: Array.isArray(entity.benefits)
      ? toMembershipBenefitListDTO(entity.benefits as any)
      : [],
  }
}

export const toMembershipLevelListDTO = (items: MembershipLevelsDocument[]): MembershipLevels[] => {
  return items.map(toMembershipLevelDTO)
}
