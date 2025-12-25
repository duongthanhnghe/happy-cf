export function toVariantCombinationDTO(combo) {
    return {
        id: combo._id.toString(),
        sku: combo.sku,
        priceModifier: combo.priceModifier,
        stock: combo.stock,
        inStock: combo.inStock,
        image: combo.image,
        variants: combo.variants,
    };
}
export function toProductDTO(entity) {
    var _a, _b, _c, _d, _e, _f;
    const price = Number(entity.price) || 0;
    const priceDiscount = Number(entity.priceDiscounts) || 0;
    const percentDiscount = price > 0 && priceDiscount > 0 && priceDiscount < price
        ? Math.round(((price - priceDiscount) / price) * 100)
        : 0;
    return {
        id: ((_a = entity._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
        productName: entity.productName,
        description: entity.description || "",
        summaryContent: entity.summaryContent || "",
        price: entity.price,
        priceDiscounts: entity.priceDiscounts,
        percentDiscount,
        amount: entity.amount,
        amountOrder: entity.amountOrder,
        image: entity.image,
        listImage: entity.listImage,
        variantGroups: (_b = entity.variantGroups) !== null && _b !== void 0 ? _b : [],
        variantCombinations: ((_c = entity.variantCombinations) !== null && _c !== void 0 ? _c : []).map(toVariantCombinationDTO),
        categoryId: entity.categoryId._id.toString(),
        category: entity.category
            ? {
                id: entity.category._id.toString(),
                categoryName: entity.category.categoryName,
                slug: entity.category.slug
            }
            : null,
        weight: entity.weight,
        sku: entity.sku,
        isActive: entity.isActive,
        createdAt: ((_d = entity.createdAt) === null || _d === void 0 ? void 0 : _d.toISOString()) || "",
        updatedAt: ((_e = entity.updatedAt) === null || _e === void 0 ? void 0 : _e.toISOString()) || "",
        vouchers: (_f = entity.vouchers) !== null && _f !== void 0 ? _f : null,
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
    const isPopulated = entity.parentId &&
        typeof entity.parentId === "object" &&
        entity.parentId._id;
    const parentObj = isPopulated ? entity.parentId : null;
    return {
        id: ((_a = entity._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
        categoryName: entity.categoryName,
        description: entity.description || "",
        image: entity.image,
        banner: entity.banner,
        order: entity.order,
        isActive: entity.isActive,
        parentId: entity.parentId
            ? (isPopulated
                ? parentObj._id.toString()
                : entity.parentId.toString())
            : null,
        parent: parentObj
            ? {
                id: parentObj._id.toString(),
                categoryName: parentObj.categoryName,
                slug: parentObj.slug,
            }
            : null,
        children: null,
        // SEO
        titleSEO: entity.titleSEO,
        descriptionSEO: entity.descriptionSEO,
        slug: entity.slug,
        keywords: entity.keywords,
        canonicalUrl: entity.canonicalUrl,
        createdAt: ((_b = entity.createdAt) === null || _b === void 0 ? void 0 : _b.toISOString()) || "",
        updatedAt: ((_c = entity.updatedAt) === null || _c === void 0 ? void 0 : _c.toISOString()) || "",
    };
}
export const toCategoryProductListDTO = (list) => list.map(toCategoryProductDTO);
//# sourceMappingURL=product.mapper.js.map