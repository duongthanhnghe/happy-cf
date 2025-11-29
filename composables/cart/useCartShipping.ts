import { showWarning } from "@/utils/toast";
import { ordersAPI } from "@/services/v1/orders.service";
import type { Ref } from 'vue';
import type { CartDTO } from '@/server/types/dto/v1/product.dto';

export const useCartShipping = (
  cartListItem: Ref<CartDTO[]>,
  totalPriceDiscount: Ref<number>,
  shippingFee: Ref<number>,
  handleCalcTotalPriceCurrent: () => void,
  reapplyFreeshippVoucher: () => Promise<void>,
  storeLocation: any,
  storeSetting: any,
  userId?: string,
  activeFreeshipVoucher?: Ref<string | null>
) => {

  const handleGetFee = async () => {
    try {
      const productWeight = cartListItem.value.reduce((total, item) => {
        return total + (item.weight || 0) * item.quantity;
      }, 0);

      if (!productWeight) return;

      const data = await ordersAPI.getFee({
        PRODUCT_WEIGHT: productWeight,
        PRODUCT_PRICE: totalPriceDiscount.value,
        MONEY_COLLECTION: totalPriceDiscount.value,
        SENDER_PROVINCE: storeSetting.getBaseInformation?.provinceCode || 1,
        SENDER_DISTRICT: storeSetting.getBaseInformation?.districtCode || 12,
        RECEIVER_PROVINCE: storeLocation.selectedProvince || 1,
        RECEIVER_DISTRICT: storeLocation.selectedDistrict || 1,
      });

      if (data.code === 0) {
        shippingFee.value = data.data.MONEY_TOTAL;

        if (userId && activeFreeshipVoucher?.value) {
          await reapplyFreeshippVoucher();
        }

        handleCalcTotalPriceCurrent();
      } else {
        shippingFee.value = 0;
        showWarning('Có lỗi khi tính phí vận chuyển, vui lòng chọn lại');
      }
    } catch (err: any) {
      showWarning(err.message);
    }
  };

  return {
    handleGetFee,
  };
};