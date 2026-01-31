import type { PaginationDTO } from "../../common/pagination.dto";
import type { ProductDTO, ProductLiteDTO } from "./product.dto";

export interface FlashSaleItemDTO {
  productId: string | ProductLiteDTO
  variantSku: string | null;

  originalPrice: number;
  salePrice: number;

  quantity: number;
  sold?: number;
  __isNew?: boolean
}

export interface FlashSaleBannerDTO {
  id: string;
  src: string;
}


export interface FlashSaleThemeDTO {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface FlashSaleDTO {
  id: string;

  name: string;
  slug: string;
  description?: string;

  startDate: string;
  endDate: string;

  isActive: boolean;
  priority: number;

  banners: FlashSaleBannerDTO[];

  theme: FlashSaleThemeDTO;

  titleSEO: string;
  descriptionSEO: string;

  badgeImage: string;

  items: FlashSaleItemDTO[];

  stackableWithVoucher: boolean;
  stackableWithPromotionGift: boolean;

  createdAt: string;
}

export type CreateFlashSaleItemDTO = Omit<FlashSaleItemDTO, "">;

export type CreateFlashSaleBody = Omit<
  FlashSaleDTO,
  | "id"
  | "createdAt"
  | "items"
> & {
  items: CreateFlashSaleItemDTO[];
};

export type UpdateFlashSaleBody = Partial<CreateFlashSaleBody>;

export type FlashSalePaginationDTO = PaginationDTO<FlashSaleDTO>;

export interface FlashSaleProductDTO {
  product: ProductDTO
  variantSku?: string
  salePrice: number
  originalPrice?: number
  quantity?: number
  sold?: number
  maxDiscountValue?: number
  maxDiscountPercent?: number
  totalSold?: number
}