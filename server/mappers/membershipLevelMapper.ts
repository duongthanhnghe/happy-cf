import type { MembershipLevelsDocument } from "../models/MembershipLevelEntity"
import type { MembershipLevels } from "../types/dto/user.dto"
import { toMembershipBenefitListDTO } from "../mappers/MembershipBenefitMapper"

export function toMembershipLevelDTO(entity: MembershipLevelsDocument): MembershipLevels {
  return {
    id: entity._id.toString(),
    name: entity.name,
    minPoint: entity.minPoint,
    icon: entity.icon,
    image: entity.image,
    benefits: Array.isArray(entity.benefits)
      ? toMembershipBenefitListDTO(entity.benefits as any)
      : [],
  }
}

export const toMembershipLevelListDTO = (items: MembershipLevelsDocument[]): MembershipLevels[] => {
  return items.map(toMembershipLevelDTO)
}
