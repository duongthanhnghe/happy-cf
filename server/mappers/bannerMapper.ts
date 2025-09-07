import type { BannerDTO } from "../types/dto/banner.dto";
import type { Banner } from "../models/BannerEntity"

export function toBannerDTO(entity: Banner): BannerDTO {
  return {
    id: entity._id.toString(),
    title: entity.title,
    description: entity.description,
    image: entity.image,
    order: entity.order,
    isActive: entity.isActive,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export const toBannerListDTO = (banners: Banner[]): BannerDTO[] => {
  return banners.map(toBannerDTO)
}
