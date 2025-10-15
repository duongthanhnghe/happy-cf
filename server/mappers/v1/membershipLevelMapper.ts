import type { MembershipLevelsDocument } from "../../models/v1/MembershipLevelEntity"
import type { MembershipLevels } from "../../types/dto/v1/user.dto"
import { toMembershipBenefitListDTO } from "../../mappers/v1/MembershipBenefitMapper"

export function toMembershipLevelDTO(entity: MembershipLevelsDocument): MembershipLevels {
  return {
    id: entity._id.toString(),
    name: entity.name,
    minPoint: entity.minPoint,
    icon: entity.icon,
    image: entity.image,
    discountRate: entity.discountRate,
    benefits: Array.isArray(entity.benefits)
      ? toMembershipBenefitListDTO(entity.benefits as any)
      : [],
  }
}

export const toMembershipLevelListDTO = (items: MembershipLevelsDocument[]): MembershipLevels[] => {
  return items.map(toMembershipLevelDTO)
}
