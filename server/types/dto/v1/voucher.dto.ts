import type { PaginationDTO } from '../../common/pagination.dto'
import { VOUCHER_TYPE } from '../../../shared/constants/voucher-type'

export interface VoucherDTO {
  id: string;
  code: string;
  name: string;
  description?: string;

  type: VOUCHER_TYPE;
  value: number;
  maxDiscount?: number;
  minOrderValue: number;

  maxShippingDiscount?: number;

  usageLimit: number;
  usedCount: number;
  limitPerUser: number;

  startDate: string;
  endDate: string;

  applicableProducts?: string[];
  applicableCategories?: string[];

  stackable: boolean;
  isActive: boolean;

  createdAt?: string;
  usedBy: {
  userId: string
  count: number
}[]
}

export interface CreateVoucherBody {
  code: string;
  name: string;
  description?: string;
  type: VOUCHER_TYPE;
  value: number;
  maxDiscount?: number;
  minOrderValue?: number;
  maxShippingDiscount?: number;
  usageLimit?: number;
  limitPerUser?: number;
  startDate: string | Date;
  endDate: string | Date;
  applicableProducts?: string[];
  applicableCategories?: string[];
  stackable?: boolean;
  isActive?: boolean;
}

export interface ApplyVoucherProduct {
  productId: string;
  name: string;
  categoryId: string;
  price: number;
  quantity: number;
}

export interface ApplyVoucherResponse {
  code: string;
  discount: number; // Số tiền giảm
  applicableProducts: ApplyVoucherProduct[]; // Danh sách sản phẩm được áp dụng giảm
  type: VOUCHER_TYPE;
  expiresAt?: string;
  stackable: boolean;
  message?: string;
}

export interface VoucherAvailableDTO extends VoucherDTO {
  isDisabled: boolean;
  disabledReason?: string;
}

export type VoucherPaginationDTO = PaginationDTO<VoucherDTO>

