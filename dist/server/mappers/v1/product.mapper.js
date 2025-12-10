export function toProductSelectedVariantDTO(variant) {
    var _a, _b, _c;
    return {
        variantId: variant.variantId,
        variantName: variant.variantName,
        priceModifier: variant.priceModifier,
        inStock: variant.inStock,
        stock: (_a = variant.stock) !== null && _a !== void 0 ? _a : 0,
        sku: (_b = variant.sku) !== null && _b !== void 0 ? _b : "",
        image: (_c = variant.image) !== null && _c !== void 0 ? _c : "",
    };
}
export function toProductVariantGroupDTO(group) {
    return {
        groupId: group.groupId,
        groupName: group.groupName,
        required: group.required,
        selectedVariants: group.selectedVariants.map(toProductSelectedVariantDTO),
    };
}
export function toProductDTO(entity) {
    var _a, _b, _c, _d;
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
        variantGroups: entity.variantGroups.map(toProductVariantGroupDTO),
        categoryId: entity.categoryId._id.toString(),
        category: entity.category
            ? {
                id: entity.category._id.toString(),
                categoryName: entity.category.categoryName,
                slug: entity.category.slug
            }
            : null,
        weight: entity.weight,
        isActive: entity.isActive,
        createdAt: ((_b = entity.createdAt) === null || _b === void 0 ? void 0 : _b.toISOString()) || "",
        updatedAt: ((_c = entity.updatedAt) === null || _c === void 0 ? void 0 : _c.toISOString()) || "",
        vouchers: (_d = entity.vouchers) !== null && _d !== void 0 ? _d : null,
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