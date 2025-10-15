import type { PostNewsDTO, CategoryNewsDTO } from "../../types/dto/v1/news.dto";
import type { PostNewsDocument, CategoryNewsDocument } from "../../models/v1/NewsEntity"

export function toPostNewsDTO(entity: PostNewsDocument): PostNewsDTO {
  return {
    id: entity._id.toString(),
    title: entity.title,
    summaryContent: entity.summaryContent,
    description: entity.description,
    image: entity.image,
    isActive: entity.isActive,
    categoryId: entity.categoryId.toString(),
    views: entity.views,
    author: entity.author,
    // SEO
    titleSEO: entity.titleSEO,
    descriptionSEO: entity.descriptionSEO,
    slug: entity.slug,
    keywords: entity.keywords,

    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export const toPostNewsListDTO = (items: PostNewsDocument[]): PostNewsDTO[] => {
  return items.map(toPostNewsDTO)
}

export function toCategoryNewsDTO(entity: CategoryNewsDocument): CategoryNewsDTO {
  return {
    id: entity._id.toString(),
    categoryName: entity.categoryName,
    summaryContent: entity.summaryContent,
    description: entity.description,
    image: entity.image,
    order: entity.order,
    isActive: entity.isActive,
    // SEO
    titleSEO: entity.titleSEO,
    descriptionSEO: entity.descriptionSEO,
    slug: entity.slug,
    keywords: entity.keywords,
    
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export const toCategoryNewsListDTO = (items: CategoryNewsDocument[]): CategoryNewsDTO[] => {
  return items.map(toCategoryNewsDTO)
}
