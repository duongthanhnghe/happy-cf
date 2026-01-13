import type { ProductVariantOption } from '@/server/models/v1/product.entity';
import type { ImportDTO, ImportItemDTO } from '../../common/import.dto';
import type { PaginationDTO } from '../../common/pagination.dto'

export interface VariantItemDTO {
  id: string;
  name: string;
  isActive: boolean;
}

export interface VariantGroupDTO {
  id: string;
  groupName: string;
  groupType?: string;
  description?: string;
  icon?: string;
  variants: VariantItemDTO[];
  hasImage: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type VariantGroupPaginationDTO = PaginationDTO<VariantGroupDTO>

export type CreateVariantGroupDTO = Omit<VariantGroupDTO, "id" | "createdAt" | "updatedAt">;

export type UpdateVariantGroupDTO = Partial<CreateVariantGroupDTO> & { id: string };

export interface ProductVariantGroupDTO {
  groupId: string;
  groupName: string;
  required: boolean;
  options: ProductVariantOption[];
}

export interface ProductVariantCombinationDTO {
  id: string;
  sku: string;
  priceModifier: number;
  stock?: number;
  inStock?: boolean;
  image?: string;
  variants: {
    groupId: string;
    groupName: string;
    variantId: string;
    variantName: string;
  }[];
}

export interface ListImageDTO {
  id: string;
  src: string;
}

export interface ProductDTO {
  id: string;
  productName: string;
  description: string;
  summaryContent: string;
  price: number
  priceDiscounts: number
  percentDiscount?: number;
  amount: number
  amountOrder: number;
  image: string;
  listImage: ListImageDTO[];
  variantGroups: ProductVariantGroupDTO[];
  variantCombinations: ProductVariantCombinationDTO[];
  categoryId: string;
  category?: CategoryProductLiteDTO | null;
  weight: number;
  sku: string;
  isActive: boolean;
  vouchers: {
  image: string;
} | null;
  createdAt: string;
  updatedAt: string;
  //SEO
  categoryBreadcrumb?: {
    label: string
    slug: string
  }[]
  titleSEO: string;
  descriptionSEO: string;
  slug: string;
  keywords?: string[]
  canonicalUrl?: string;
}

export interface ProductExportDTO {
  id: string;
  productName: string;
  image: string;
  categoryId: string;
  price: number;
  priceDiscounts: number;
  amount: number;
  description: string;
  summaryContent: string;
  isActive: boolean;
  weight: number;
  sku: string;
  titleSEO: string;
  descriptionSEO: string;
  keywords?: string[];
  slug: string;
}

export interface ProductImportTableItem {
  rowIndex?: string;
  productName: string;
  image: string;
  categoryId: string;
  price: number;
  priceDiscounts: number;
  amount: number;
  isActive: boolean;
  sku: string;
  weight: number;
  description: string;
  summaryContent: string;
  titleSEO?: string;
  descriptionSEO?: string;
  keywords?: string;
  slug?: string;
  status?: string;
  message?: string;
}

export type ProductPaginationDTO = PaginationDTO<ProductDTO>

export type ProductImportDTO = ImportDTO<ProductDTO>

export type ProductImportItemDTO = ImportItemDTO<ProductDTO> 

export type CheckStockResult = {
  isAvailable: boolean
  availableQuantity?: number
  message?: string
}

export interface CategoryProductLiteDTO {
  id: string;
  categoryName: string;
  slug: string;
}

export interface CategoryProductDTO {
  id: string;
  categoryName: string;
  description: string;
  image: string;
  banner?: string;
  order: number;
  isActive: boolean;
  parentId: string | null;
  parent?: CategoryProductLiteDTO | null;
  children?: CategoryProductDTO[] | null;
  //SEO
  titleSEO: string;
  descriptionSEO: string;
  slug: string;
  keywords?: string[]
  canonicalUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateProductDTO = Omit<ProductDTO, "id" | "createdAt" | "updatedAt" | "amountOrder" | "vouchers">;

export type UpdateProductDTO = Partial<CreateProductDTO> & { id: string; };

export type CreateCategoryProductBody = Omit<CategoryProductDTO, "id" | "createdAt" | "updatedAt" >;

export type UpdateCategoryProductBody = Partial<CreateCategoryProductBody> & { id: string };

export interface WishlistItem {
  id: string
  userId: string
  product: ProductDTO
  createdAt: Date
}

export type CategoryProductPaginationDTO = PaginationDTO<CategoryProductDTO>

export type CreateCategoryProductDTO = Omit<CategoryProductDTO, "id" | "createdAt" | "updatedAt" | "order"> 

export type UpdateCategoryProductDTO = Partial<Omit<CreateCategoryProductDTO, "createdAt" | "updatedAt">> & { id: string }

export interface CategoryWithProductsDTO
  extends Omit<CategoryProductDTO, 'children'> {
  products: ProductPaginationDTO
  children?: CategoryProductDTO[] | null
}


export interface SelectedOptionPushDTO {
  id?: string
  optionName: string
  variantName: string
  variantPrice: number
}

export interface VariantGroupUI {
  groupId: string
  groupName: string
  variants: {
    variantId: string
    variantName: string
    hasStock: boolean
  }[]
}

export interface CartDTO {
  id?: string;
  sku?: string;
  stock?: number
  product: string | ProductDTO;
  productKey?: string;
  combinationId?: string
  quantity: number;
  note?: string;
  price?: number;
  priceDiscounts?: number;
  weight?: number;
  categoryId?: string;
  productName?: string;
  image?: string;
  summaryContent?: string;
  variantGroups?: ProductVariantGroupDTO[];
  variantCombination?: ProductVariantCombinationDTO;
  variantCombinations?: ProductVariantCombinationDTO[];
}

export type SelectedOptionDTO = SelectedOptionPushDTO & {id: string}

export type SelectedOptionMap = Record<string, string>;

export type ProductSortType = ""|"discount" | "popular" | "price_desc" | "price_asc"

export type ProductFilterOption = {
  title: string
  value: ProductSortType
}