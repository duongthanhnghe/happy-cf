import type {
  Product,
  CategoryProduct,
  Option,
  Variant,
} from "../../models/v1/product.entity";
import type {
  ProductDTO,
  CategoryProductDTO,
  OptionDTO,
  VariantDTO,
} from "../../types/dto/v1/product.dto";

export function toVariantDTO(entity: Variant): VariantDTO {
  return {
    id: entity.id,
    name: entity.name,
    priceModifier: entity.priceModifier,
    inStock: entity.inStock,
  };
}

export function toOptionDTO(entity: Option): OptionDTO {
  return {
    id: entity.id,
    name: entity.name,
    required: entity.required,
    variants: entity.variants.map(toVariantDTO),
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
    options: entity.options.map(toOptionDTO),
    categoryId: entity.categoryId ? entity.categoryId.toString() : "",
    weight: entity.weight,
    isActive: entity.isActive,
    createdAt: entity.createdAt?.toISOString() || "",
    updatedAt: entity.updatedAt?.toISOString() || "",
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
