import type { MembershipBenefitDocument } from "../models/MembershipBenefitEntity";
import type { MembershipBenefitDTO } from "../types/dto/user.dto"

export function toMembershipBenefitDTO(entity: MembershipBenefitDocument): MembershipBenefitDTO {
  return {
    id: entity._id.toString(),
    name: entity.name,
    description: entity.description,
    icon: entity.icon,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  }
}
  
export const toMembershipBenefitListDTO = (items: MembershipBenefitDocument[]): MembershipBenefitDTO[] => {
  return items.map(toMembershipBenefitDTO)
}


