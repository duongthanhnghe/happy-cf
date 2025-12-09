import type { VariantGroup } from "../../models/v1/variant-group.entity";
import type { VariantGroupDTO } from "../../types/dto/v1/product.dto";

export const toVariantGroupDTO = (group: VariantGroup): VariantGroupDTO => {
  return {
    id: group._id.toString(),
    groupName: group.groupName,
    groupType: group.groupType,
    description: group.description,
    icon: group.icon,
    variants: group.variants.map(v => ({
      id: v.id,
      name: v.name,
      isActive: v.isActive
    })),
    hasImage: group.hasImage,
    isActive: group.isActive,
    createdAt: group.createdAt.toISOString(),
    updatedAt: group.updatedAt.toISOString()
  };
};

export const toVariantGroupListDTO = (groups: VariantGroup[]): VariantGroupDTO[] => {
  return groups.map(toVariantGroupDTO);
};