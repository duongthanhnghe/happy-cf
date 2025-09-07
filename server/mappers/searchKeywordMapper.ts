import type { SearchKeyword } from "../models/SearchKeywordEntity"
import type { SearchKeywordDTO } from "../types/dto/search-keyword.dto"

export function toSearchKeywordDTO(entity: SearchKeyword): SearchKeywordDTO {
  return {
    id: entity._id.toString(),
    keyword: entity.keyword,
    totalCount: entity.totalCount,
    lastSearchTime: entity.lastSearchTime,
    createdAt: entity.createdAt.toISOString(),
  }
}

export const toSearchKeywordListDTO = (keywords: SearchKeyword[]): SearchKeywordDTO[] => {
  return keywords.map(toSearchKeywordDTO)
}
