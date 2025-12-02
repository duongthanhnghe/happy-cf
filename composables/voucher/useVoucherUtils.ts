import { VOUCHER_TYPE } from '@/shared/constants/voucher-type'
import type { VoucherType } from '@/shared/constants/voucher-type'

export function useVoucherUtils() {

  const isDiscountVoucherType = (type: VoucherType): boolean => {
    return [
      VOUCHER_TYPE.percentage.type,
      VOUCHER_TYPE.product.type,
      VOUCHER_TYPE.timed.type,
    ].includes(type)
  }

  return {
    isDiscountVoucherType
  };
}