import type { AboutDTO } from "../../types/dto/v1/about.dto";
import type { About } from "../../models/v1/AboutEntity";

export function toAboutDTO(entity: About): AboutDTO {
  return {
    id: entity._id.toString(),
    title: entity.title,
    description: entity.description,
    summaryContent: entity.summaryContent,
    image: entity.image,
    listImage: entity.listImage,
    order: entity.order,
    isActive: entity.isActive,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export const toAboutListDTO = (about: About[]): AboutDTO[] => {
  return about.map(toAboutDTO)
}
