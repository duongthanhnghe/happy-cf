import type { SearchKeyword } from "../../models/v1/SearchKeywordEntity"
import type { SearchKeywordDTO } from "../../types/dto/v1/search-keyword.dto"

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
