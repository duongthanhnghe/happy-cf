import type {
  Product,
  CategoryProduct,
  ProductSelectedVariant,
  ProductVariantGroup,
} from "../../models/v1/product.entity";
import type {
  ProductDTO,
  CategoryProductDTO,
  ProductSelectedVariantDTO,
  ProductVariantGroupDTO,
} from "../../types/dto/v1/product.dto";

export function toProductSelectedVariantDTO(
  variant: ProductSelectedVariant
): ProductSelectedVariantDTO {
  return {
    variantId: variant.variantId,
    variantName: variant.variantName,
    priceModifier: variant.priceModifier,
    inStock: variant.inStock,
    stock: variant.stock ?? 0,
    sku: variant.sku ?? "",
  };
}

export function toProductVariantGroupDTO(
  group: ProductVariantGroup
): ProductVariantGroupDTO {
  
  return {
    groupId: group.groupId,
    groupName: group.groupName,
    required: group.required,
    selectedVariants: group.selectedVariants.map(toProductSelectedVariantDTO),
  };
}


export function toProductDTO(entity: Product): ProductDTO {
  return {
    id: entity._id?.toString() || "",
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
    categoryId: entity.categoryId ? entity.categoryId.toString() : "",
    weight: entity.weight,
    isActive: entity.isActive,
    createdAt: entity.createdAt?.toISOString() || "",
    updatedAt: entity.updatedAt?.toISOString() || "",
    vouchers: entity.vouchers ?? null,
    // SEO
    titleSEO: entity.titleSEO,
    descriptionSEO: entity.descriptionSEO,
    slug: entity.slug,
    keywords: entity.keywords,
  };
}

export const toProductListDTO = (list: Product[]): ProductDTO[] =>
  list.map(toProductDTO);

export function toCategoryProductDTO(entity: CategoryProduct): CategoryProductDTO {
  return {
    id: entity._id?.toString() || "",
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
    createdAt: entity.createdAt?.toISOString() || "",
    updatedAt: entity.updatedAt?.toISOString() || "",
  };
}

export const toCategoryProductListDTO = (list: CategoryProduct[]): CategoryProductDTO[] =>
  list.map(toCategoryProductDTO);
