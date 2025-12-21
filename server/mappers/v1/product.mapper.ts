import type {
  Product,
  CategoryProduct,
  ProductVariantCombination,
} from "../../models/v1/product.entity";
import type {
  ProductDTO,
  CategoryProductDTO,
  ProductVariantCombinationDTO,
} from "../../types/dto/v1/product.dto";


export function toVariantCombinationDTO(
  combo: ProductVariantCombination
): ProductVariantCombinationDTO {
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
    variantGroups: entity.variantGroups ?? [],
    variantCombinations: (entity.variantCombinations ?? []).map(
      toVariantCombinationDTO
    ),
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
  const isPopulated =
    entity.parentId &&
    typeof entity.parentId === "object" &&
    (entity.parentId as any)._id;

  const parentObj = isPopulated ? (entity.parentId as any) : null;

  return {
    id: entity._id?.toString() || "",
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
    createdAt: entity.createdAt?.toISOString() || "",
    updatedAt: entity.updatedAt?.toISOString() || "",
  };
}

export const toCategoryProductListDTO = (list: CategoryProduct[]): CategoryProductDTO[] =>
  list.map(toCategoryProductDTO);
