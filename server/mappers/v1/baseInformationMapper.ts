import type { BaseInformationDTO } from "../../types/dto/v1/base-information.dto";
import type { BaseInformation } from "../../models/v1/BaseInformationEntity";

export function toBaseInformationDTO(entity: BaseInformation): BaseInformationDTO {
  return {
    name: entity.name,
    logoUrl: entity.logoUrl,
    phone: entity.phone,
    email: entity.email,
    address: entity.address,
    openingHours: entity.openingHours,
    socialLinks: entity.socialLinks || [],
    description: entity.description,
    provinceCode: entity.provinceCode,
    districtCode: entity.districtCode,
    wardCode: entity.wardCode,
    createdAt: entity.createdAt?.toISOString(),
    updatedAt: entity.updatedAt?.toISOString(),
  };
}

export const toBaseInformationListDTO = (entities: BaseInformation[]): BaseInformationDTO[] => {
  return entities.map(toBaseInformationDTO);
};
