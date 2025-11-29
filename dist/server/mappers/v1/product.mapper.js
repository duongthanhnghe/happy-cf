export function toVariantDTO(entity) {
    return {
        id: entity.id,
        name: entity.name,
        priceModifier: entity.priceModifier,
        inStock: entity.inStock,
    };
}
export function toOptionDTO(entity) {
    return {
        id: entity.id,
        name: entity.name,
        required: entity.required,
        variants: entity.variants.map(toVariantDTO),
    };
}
export function toProductDTO(entity) {
    var _a, _b, _c;
    return {
        id: ((_a = entity._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
        productName: entity.productName,
        description: entity.description || "",
        summaryContent: entity.summaryContent || "",
        price: entity.price,
        priceDiscounts: entity.priceDiscounts,
        amount: entity.amount,
        amountOrder: entity.amountOrder,
        image: entity.image,
        listImage: entity.listImage,
        options: entity.options.map(toOptionDTO),
        categoryId: entity.categoryId ? entity.categoryId.toString() : "",
        weight: entity.weight,
        isActive: entity.isActive,
        createdAt: ((_b = entity.createdAt) === null || _b === void 0 ? void 0 : _b.toISOString()) || "",
        updatedAt: ((_c = entity.updatedAt) === null || _c === void 0 ? void 0 : _c.toISOString()) || "",
        // SEO
        titleSEO: entity.titleSEO,
        descriptionSEO: entity.descriptionSEO,
        slug: entity.slug,
        keywords: entity.keywords,
    };
}
export const toProductListDTO = (list) => list.map(toProductDTO);
export function toCategoryProductDTO(entity) {
    var _a, _b, _c;
    return {
        id: ((_a = entity._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
        categoryName: entity.categoryName,
        description: entity.description || "",
        image: entity.image,
        banner: entity.banner,
        order: entity.order,
        isActive: entity.isActive,
        parentId: entity.parentId ? entity.parentId.toString() : "",
        // SEO
        titleSEO: entity.titleSEO,
        descriptionSEO: entity.descriptionSEO,
        slug: entity.slug,
        keywords: entity.keywords,
        createdAt: ((_b = entity.createdAt) === null || _b === void 0 ? void 0 : _b.toISOString()) || "",
        updatedAt: ((_c = entity.updatedAt) === null || _c === void 0 ? void 0 : _c.toISOString()) || "",
    };
}
export const toCategoryProductListDTO = (list) => list.map(toCategoryProductDTO);
//# sourceMappingURL=product.mapper.js.map