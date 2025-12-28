import mongoose from 'mongoose';
import slugify from 'slugify';
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
export const toProductExport = (p) => ({
    id: p._id.toString(),
    productName: p.productName,
    image: p.image,
    categoryId: String(p.categoryId),
    price: p.price,
    priceDiscounts: p.priceDiscounts,
    amount: p.amount,
    description: p.description || '',
    summaryContent: p.summaryContent || '',
    isActive: p.isActive,
    weight: p.weight,
    sku: p.sku,
    titleSEO: p.titleSEO,
    descriptionSEO: p.descriptionSEO,
    keywords: Array.isArray(p.keywords) ? p.keywords : [],
    slug: p.slug,
});
export const toProductCreatePayload = (row, category) => ({
    productName: row.productName.trim(),
    price: Number(row.price),
    priceDiscounts: Number(row.priceDiscounts || 0),
    amount: Number(row.amount || 0),
    description: row.description || '',
    summaryContent: row.summaryContent || '',
    image: row.image || '',
    listImage: [],
    variantGroups: [],
    variantCombinations: [],
    categoryId: new mongoose.Types.ObjectId(category._id),
    weight: Number(row.weight || 0),
    sku: row.sku ||
        `PRD-${category._id.toString().slice(0, 5)}-${Date.now()}`,
    isActive: Boolean(row.isActive),
    titleSEO: row.titleSEO || row.productName,
    descriptionSEO: row.descriptionSEO || '',
    slug: row.slug || slugify(row.productName, { lower: true }),
    keywords: row.keywords ? row.keywords.split(',') : [],
});
export const applyProductUpdate = (product, row, category) => {
    var _a;
    product.productName = row.productName;
    product.price = Number(row.price);
    product.priceDiscounts = Number(row.priceDiscounts || 0);
    product.amount = Number(row.amount || 0);
    product.description = row.description || '';
    product.summaryContent = row.summaryContent || '';
    product.image = row.image || '';
    product.isActive = (_a = row.isActive) !== null && _a !== void 0 ? _a : product.isActive;
    product.weight = Number(row.weight || 0);
    product.sku = row.sku || product.sku;
    product.titleSEO = row.titleSEO || product.titleSEO;
    product.descriptionSEO = row.descriptionSEO || product.descriptionSEO;
    product.keywords = row.keywords ? row.keywords.split(',') : [];
    product.categoryId = category._id;
    product.slug = row.slug || product.slug;
};
//# sourceMappingURL=product.mapper.js.map