import type { PaginationDTO } from '../../common/pagination.dto'
export interface VariantDTO {
  id: string;
  name: string;
  priceModifier: number | null;
  inStock: boolean;
}

export interface OptionDTO {
  id: string;
  name: string;
  required: boolean;
  variants: VariantDTO[];
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
  options: OptionDTO[];
  categoryId: string;
  weight: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  //SEO
  titleSEO: string;
  descriptionSEO: string;
  slug: string;
  keywords?: string[]
  canonicalUrl?: string;
}

export type ProductPaginationDTO = PaginationDTO<ProductDTO>

export interface CategoryProductDTO {
  id: string;
  categoryName: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
  parentId: string | null;
  //SEO
  titleSEO: string;
  descriptionSEO: string;
  slug: string;
  keywords?: string[]
  canonicalUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateProductDTO = Omit<ProductDTO, "id" | "createdAt" | "updatedAt" | "amountOrder">;

export type UpdateProductDTO = Partial<CreateProductDTO> & { id: string; };

export type CreateCategoryProductBody = Omit<CategoryProductDTO, "id" | "createdAt" | "updatedAt" >;

export type UpdateCategoryProductBody = Partial<CreateCategoryProductBody> & { id: string };

export interface WishlistItem {
  id: string
  userId: string
  product: ProductDTO
  createdAt: Date
}

export type CreateCategoryProductDTO = Omit<CategoryProductDTO, "id" | "createdAt" | "updatedAt" | "order"> 

export type UpdateCategoryProductDTO = Partial<Omit<CreateCategoryProductDTO, "createdAt" | "updatedAt">> & { id: string }


export interface CategoryWithProductsDTO extends CategoryProductDTO {
  products: ProductPaginationDTO
  children: CategoryProductDTO[] | null
}

export interface SelectedOptionPushDTO {
  id: string
  optionName: string
  variantName: string
  variantPrice: number
}

// export interface CartDTO extends ProductDTO {
//   product: ProductDTO | string;
//   productKey?: string
//   note?: string
//   finalPriceDiscounts?: number
//   quantity: number
//   finalPrice?: number
//   selectedOptionsPush?: SelectedOptionPushDTO[] | null
// }

export interface CartDTO {
  id?: string; // optional nếu FE không dùng
  product: string | ProductDTO; // <-- lúc đầu chỉ là string (id), sau khi merge là object
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
}

export type SelectedOptionDTO = SelectedOptionPushDTO & {id: string}

export type SelectedOptionMap = Record<string, string>;

export type ProductSortType = "discount" | "popular" | "price_desc" | "price_asc"