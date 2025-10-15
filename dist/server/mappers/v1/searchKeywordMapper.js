export function toSearchKeywordDTO(entity) {
    return {
        id: entity._id.toString(),
        keyword: entity.keyword,
        totalCount: entity.totalCount,
        lastSearchTime: entity.lastSearchTime,
        createdAt: entity.createdAt.toISOString(),
    };
}
export const toSearchKeywordListDTO = (keywords) => {
    return keywords.map(toSearchKeywordDTO);
};
//# sourceMappingURL=searchKeywordMapper.js.map