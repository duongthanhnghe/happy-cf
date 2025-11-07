import type { MembershipBenefitDocument } from "../../models/v1/membership-benefit.entity";
import type { MembershipBenefitDTO } from "../../types/dto/v1/user.dto"

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


