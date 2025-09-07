import type { MembershipLevelsDocument } from "../models/MembershipLevelEntity"
import type { MembershipLevels } from "../types/dto/user.dto"

export function toMembershipLevelDTO(entity: MembershipLevelsDocument): MembershipLevels {
  return {
    id: entity._id.toString(),
    name: entity.name,
    minPoint: entity.minPoint,
    icon: entity.icon,
    image: entity.image,
  }
}

export const toMembershipLevelListDTO = (items: MembershipLevelsDocument[]): MembershipLevels[] => {
  return items.map(toMembershipLevelDTO)
}
