export type VoucherType = 
  | "percentage"  // Giảm theo %
  | "fixed"       // Giảm số tiền cố định
  | "freeship"    // Miễn phí / giảm phí vận chuyển
  | "product"     // Giảm cho sản phẩm / danh mục cụ thể
  | "timed"       // Giảm theo thời gian (flash sale)

export interface VoucherTypeItem {
  name: string
  type: VoucherType
  color: string
}

export const VOUCHER_TYPE: Record<VoucherType, VoucherTypeItem> = {
  percentage: {
    name: "Giảm theo %",
    type: "percentage",
    color: "green",
  },
  fixed: {
    name: "Giảm theo số tiền",
    type: "fixed",
    color: "orange",
  },
  freeship: {
    name: "Giảm phí vận chuyển",
    type: "freeship",
    color: "blue",
  },
  product: {
    name: "Giảm theo danh mục",
    type: "product",
    color: "purple",
  },
  timed: {
    name: "Giảm theo thời gian",
    type: "timed",
    color: "red",
  },
} as const
