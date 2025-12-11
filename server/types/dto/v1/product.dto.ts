import type { ImportDTO, ImportItemDTO } from '../../common/import.dto';
import type { PaginationDTO } from '../../common/pagination.dto'
import type { VoucherDTO } from './voucher.dto';

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

export interface AddVariantToGroupDTO {
  groupId: string;
  variantId: string;
  variantName: string;
}

export interface RemoveVariantFromGroupDTO {
  groupId: string;
  variantId: string;
}

export interface ProductSelectedVariantDTO {
  variantId: string;
  variantName: string;
  priceModifier: number;
  inStock: boolean;
  stock: number;
  sku: string;
  image: string;
}

export interface ProductVariantGroupDTO {
  groupId: string;
  groupName: string;
  required: boolean;
  selectedVariants: ProductSelectedVariantDTO[];
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
  amount: number
  amountOrder: number;
  image: string;
  listImage: ListImageDTO[];
  variantGroups: ProductVariantGroupDTO[];
  categoryId: string;
  category?: CategoryProductLiteDTO | null;
  weight: number;
  isActive: boolean;
  vouchers: {
  image: string;
} | null;
  createdAt: string;
  updatedAt: string;
  //SEO
  titleSEO: string;
  descriptionSEO: string;
  slug: string;
  keywords?: string[]
  canonicalUrl?: string;
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
  weight: number;
  description: string;
  summaryContent: string;
  titleSEO?: string;
  descriptionSEO?: string;
  keywords?: string;
  status?: string;
  message?: string;
}

export type ProductPaginationDTO = PaginationDTO<ProductDTO>

export type ProductImportDTO = ImportDTO<ProductDTO>

export type ProductImportItemDTO = ImportItemDTO<ProductDTO> 

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


export interface CategoryWithProductsDTO extends CategoryProductDTO {
  products: ProductPaginationDTO
  children: CategoryProductDTO[] | null
}

export interface SelectedOptionPushDTO {
  id?: string
  optionName: string
  variantName: string
  variantPrice: number
}

export interface CartDTO {
  id?: string;
  product: string | ProductDTO;
  productKey?: string;
  quantity: number;
  note?: string;
  selectedOptionsPush?: SelectedOptionPushDTO[];
  finalPrice?: number;
  finalPriceDiscounts?: number;
  price?: number;
  priceDiscounts?: number;
  weight?: number;
  categoryId?: string;
  productName?: string;
  image?: string;
  summaryContent?: string;
  variantGroups?: ProductVariantGroupDTO[];
}

export type SelectedOptionDTO = SelectedOptionPushDTO & {id: string}

export type SelectedOptionMap = Record<string, string>;

export type ProductSortType = ""|"discount" | "popular" | "price_desc" | "price_asc"

export type ProductFilterOption = {
  title: string
  value: ProductSortType
}