export function toPostNewsDTO(entity) {
    var _a, _b, _c;
    return {
        id: entity._id.toString(),
        title: entity.title,
        summaryContent: entity.summaryContent,
        description: entity.description,
        image: entity.image,
        isActive: entity.isActive,
        // categoryId: entity.categoryId.toString(),
        categoryId: typeof entity.categoryId === 'string' ? entity.categoryId : (_b = (_a = entity.categoryId) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString(),
        views: entity.views,
        author: entity.author,
        // categoryName: entity.categoryName || undefined,
        categoryName: entity.categoryName || (typeof entity.categoryId !== 'string' ? (_c = entity.categoryId) === null || _c === void 0 ? void 0 : _c.categoryName : undefined),
        // SEO
        titleSEO: entity.titleSEO,
        descriptionSEO: entity.descriptionSEO,
        slug: entity.slug,
        keywords: entity.keywords,
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
        // SEO
        titleSEO: entity.titleSEO,
        descriptionSEO: entity.descriptionSEO,
        slug: entity.slug,
        keywords: entity.keywords,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
    };
}
export const toCategoryNewsListDTO = (items) => {
    return items.map(toCategoryNewsDTO);
};
//# sourceMappingURL=news.mapper.js.map