import type { CreateVoucherBody } from '@/server/types/dto/v1/voucher.dto';
import { computed } from 'vue';
import { showWarning } from '@/utils/toast';
import { VOUCHER_TYPE } from '@/shared/constants/voucher-type';

export function useVoucherForm(formItem: CreateVoucherBody) {

  const type = computed(() => formItem.type);

  const showValue = computed(() => type.value !== VOUCHER_TYPE.freeship.type);
  const showMaxDiscount = computed(() => type.value === VOUCHER_TYPE.percentage.type);
  const showMaxShippingDiscount = computed(() => type.value === VOUCHER_TYPE.freeship.type);
  const showProduct = computed(() => type.value === VOUCHER_TYPE.product.type);

  const validateVoucher = () => {
    const { type: t, value, maxDiscount, minOrderValue, maxShippingDiscount, applicableCategories, startDate, endDate } = formItem;

    if (!startDate || !endDate) return showWarning('Vui lòng chọn ngày bắt đầu và kết thúc!');

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    if (end <= start) return showWarning('Ngày kết thúc phải lớn hơn ngày bắt đầu!');

    if (end <= now) return showWarning('Ngày kết thúc phải lớn hơn ngày hiện tại!');

    switch (t) {
      case VOUCHER_TYPE.percentage.type:
        if (!value) {
          return showWarning('Giá trị giảm (%) khong duoc qua 100%!');
        }

        if (!value || !maxDiscount || !minOrderValue) {
          return showWarning('Vui lòng nhập đủ: Giá trị giảm (%), Giảm tối đa và Đơn hàng tối thiểu!');
        }
        break;

      case VOUCHER_TYPE.freeship.type:
        if (!maxShippingDiscount || !minOrderValue) {
          return showWarning('Vui lòng nhập đủ: Giảm phí vận chuyển tối đa và Đơn hàng tối thiểu!');
        }
        break;

      case VOUCHER_TYPE.fixed.type:
        if (!value || !minOrderValue) {
          return showWarning('Vui lòng nhập đủ: Giá trị giảm (VNĐ) và Đơn hàng tối thiểu!');
        }
        break;

      case VOUCHER_TYPE.product.type:
        if (value > 100) {
          return showWarning('Giá trị giảm (%) khong duoc qua 100%!');
        }

        if (!value || !maxDiscount || !minOrderValue) {
          return showWarning('Vui lòng nhập đủ: Giá trị giảm (%), Giảm tối đa và Đơn hàng tối thiểu!');
        }

        if (!applicableCategories || applicableCategories.length === 0) {
          return showWarning('Vui lòng chọn ít nhất 1 danh mục áp dụng!');
        }
        break;

      case VOUCHER_TYPE.timed.type:
        if (!value || !startDate || !endDate) {
          return showWarning('Vui lòng nhập đủ: Giá trị giảm và thời gian áp dụng (bắt đầu / kết thúc)!');
        }
        break;

      default:
        break;
    }

    return true;
  };

  return {
    type,
    showValue,
    showMaxDiscount,
    showMaxShippingDiscount,
    showProduct,
    validateVoucher,
  };
}
