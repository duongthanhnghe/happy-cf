import type { PaginationDTO } from '../../common/pagination.dto'
import { VOUCHER_TYPE } from '../../../shared/constants/voucher-type'

export interface VoucherUsageDTO {
  id: string

  voucherId: string
  userId: {
    _id: string
    fullname: string
    phone: string
  }
  orderId: string

  code: string
  type: VOUCHER_TYPE
  discount: number

  applicableProducts?: {
    productId: string
    name: string
    categoryId?: string
    price: number
    quantity: number
  }[]

  expiresAt?: string | null
  stackable: boolean

  usedAt: string
  reverted: boolean
  revertedAt?: string | null

  meta?: {
    ip?: string
    userAgent?: string
  }

  createdAt: string
  updatedAt: string
}

export type VoucherUsagePaginationDTO = PaginationDTO<VoucherUsageDTO>
