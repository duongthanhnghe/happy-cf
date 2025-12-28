import type {
  Product,
  CategoryProduct,
  ProductVariantCombination,
} from "../../models/v1/product.entity";
import type {
  ProductDTO,
  CategoryProductDTO,
  ProductVariantCombinationDTO,
  ProductExportDTO,
  ProductImportTableItem,
} from "../../types/dto/v1/product.dto";
import mongoose from 'mongoose'
import slugify from 'slugify'

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
  const price = Number(entity.price) || 0
  const priceDiscount = Number(entity.priceDiscounts) || 0

  const percentDiscount =
    price > 0 && priceDiscount > 0 && priceDiscount < price
      ? Math.round(((price - priceDiscount) / price) * 100)
      : 0

  return {
    id: entity._id?.toString() || "",
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

export const toProductExport = (p: Product): ProductExportDTO => ({
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

export const toProductCreatePayload = (
  row: any,
  category: CategoryProduct
) => ({
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
  sku:
    row.sku ||
    `PRD-${category._id.toString().slice(0, 5)}-${Date.now()}`,
  isActive: Boolean(row.isActive),
  titleSEO: row.titleSEO || row.productName,
  descriptionSEO: row.descriptionSEO || '',
  slug: row.slug || slugify(row.productName, { lower: true }),
  keywords: row.keywords ? row.keywords.split(',') : [],
})

export const applyProductUpdate = (
  product: Product,
  row: any,
  category: CategoryProduct
) => {
  product.productName = row.productName
  product.price = Number(row.price)
  product.priceDiscounts = Number(row.priceDiscounts || 0)
  product.amount = Number(row.amount || 0)
  product.description = row.description || ''
  product.summaryContent = row.summaryContent || ''
  product.image = row.image || ''
  product.isActive = row.isActive ?? product.isActive
  product.weight = Number(row.weight || 0)
  product.sku = row.sku || product.sku
  product.titleSEO = row.titleSEO || product.titleSEO
  product.descriptionSEO = row.descriptionSEO || product.descriptionSEO
  product.keywords = row.keywords ? row.keywords.split(',') : []
  product.categoryId = category._id
  product.slug = row.slug || product.slug
}