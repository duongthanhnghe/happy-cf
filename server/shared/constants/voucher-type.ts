export enum VOUCHER_TYPE {
  PERCENTAGE = "percentage", // Giảm theo %
  FIXED = "fixed",           // Giảm số tiền cố định
  FREESHIP = "freeship",     // Miễn phí / giảm phí vận chuyển
  PRODUCT = "product",       // Giảm cho sản phẩm / danh mục cụ thể
  TIMED = "timed",           // Giảm theo thời gian (flash sale)
}

export const VOUCHER_TYPE_LIST = Object.values(VOUCHER_TYPE);
