export function toPostNewsDTO(entity) {
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
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
    };
}
export const toPostNewsListDTO = (items) => {
    return items.map(toPostNewsDTO);
};
export function toCategoryNewsDTO(entity) {
    return {
        id: entity._id.toString(),
        categoryName: entity.categoryName,
        summaryContent: entity.summaryContent,
        description: entity.description,
        image: entity.image,
        order: entity.order,
        isActive: entity.isActive,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
    };
}
export const toCategoryNewsListDTO = (items) => {
    return items.map(toCategoryNewsDTO);
};
//# sourceMappingURL=newsMapper.js.map