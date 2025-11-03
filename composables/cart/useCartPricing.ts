import type { Ref } from 'vue';
import type { CartDTO } from '@/server/types/dto/v1/product.dto';

export const useCartPricing = (
  cartListItem: Ref<CartDTO[]>,
  totalPriceCurrent: Ref<number>,
  totalPriceDiscount: Ref<number>,
  orderPriceDiscount: Ref<number>,
  totalPriceSave: Ref<number>,
  shippingFee: Ref<number>,
  totalDiscountRateMembership: Ref<number>,
  discountVoucher: Ref<number>,
  discountVoucherFreeship: Ref<number>,
  usedPointOrder: { usedPoint: number },
  isCalculating: Ref<boolean>
) => {

  const calculateTotalPriceCurrent = () => {
    return cartListItem.value.reduce((total, item) => {
      if (item.selectedOptionsPush && item.finalPrice) {
        return total + item.finalPrice * item.quantity;
      }
      return total + (item.price || 0) * item.quantity;
    }, 0);
  };

  const calculateTotalPriceDiscount = (membershipDiscountRate?: number) => {
    let discount = cartListItem.value.reduce((total, item) => {
      if (item.selectedOptionsPush && item.finalPriceDiscounts) {
        return total + item.finalPriceDiscounts * item.quantity;
      }
      return total + (item.priceDiscounts || 0) * item.quantity;
    }, 0);

    if (usedPointOrder.usedPoint && usedPointOrder.usedPoint !== 0) {
      discount = discount - usedPointOrder.usedPoint;
    }

    if (membershipDiscountRate && membershipDiscountRate !== 0) {
      totalDiscountRateMembership.value = totalPriceCurrent.value * (membershipDiscountRate / 100);
      discount = discount - totalDiscountRateMembership.value;
    }

    discount = discount + shippingFee.value - discountVoucher.value - discountVoucherFreeship.value;

    return discount;
  };

  const handleCalcTotalPriceCurrent = (membershipDiscountRate?: number) => {
    if (isCalculating.value) return;
    
    isCalculating.value = true;

    totalPriceCurrent.value = calculateTotalPriceCurrent();
    
    totalPriceDiscount.value = cartListItem.value.reduce((total, item) => {
      if (item.selectedOptionsPush && item.finalPriceDiscounts) {
        return total + item.finalPriceDiscounts * item.quantity;
      }
      return total + (item.priceDiscounts || 0) * item.quantity;
    }, 0);

    orderPriceDiscount.value = totalPriceDiscount.value;

    totalPriceDiscount.value = calculateTotalPriceDiscount(membershipDiscountRate);

    totalPriceSave.value = totalPriceCurrent.value - totalPriceDiscount.value + shippingFee.value;

    isCalculating.value = false;
  };

  return {
    calculateTotalPriceCurrent,
    calculateTotalPriceDiscount,
    handleCalcTotalPriceCurrent,
  };
};