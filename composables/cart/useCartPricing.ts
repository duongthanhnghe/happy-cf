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
  isCalculating: Ref<boolean>,
  Config_EnableUsePoint: Ref<boolean>,
) => {

  const calculateTotalPriceCurrent = () => {
    return cartListItem.value.reduce((total, item) => {
      if (item.variantCombination) {
        return total + item.variantCombination.priceModifier * item.quantity;
      }
      return total + (item.price || 0) * item.quantity;
    }, 0);
  };

  const calculateOrderPriceDiscount = () => {
    let value = cartListItem.value.reduce((total, item) => {
      if (item.variantCombination) {
        return 0
      }
      if(item.price && item.priceDiscounts) {
        return total + (item.price - item.priceDiscounts || 0) * item.quantity;
      }

      return total
    }, 0);

    return value || 0
  }

  const calculatePriceSave = () => {
    let value = orderPriceDiscount.value + totalDiscountRateMembership.value + discountVoucher.value + discountVoucherFreeship.value;

    // su dung diem
    if (usedPointOrder.usedPoint && Config_EnableUsePoint.value) {
      value = value + usedPointOrder.usedPoint;
    }

    return value || 0
  }

  const calculatePriceDiscountRateMembership = (membershipDiscountRate: number) => {
    if (membershipDiscountRate <= 0) {
      totalDiscountRateMembership.value = 0
      return 0
    }

    const raw = totalPriceCurrent.value * (membershipDiscountRate / 100)

    const value = Math.round(raw)

    totalDiscountRateMembership.value = value
    return value
  }

  const calculatePriceTotalOrder = () => {
    let value = totalPriceCurrent.value + shippingFee.value - totalPriceSave.value;

    return value || 0
  }

  const handleCalcTotalPriceCurrent = (membershipDiscountRate?: number) => {
    if (isCalculating.value) return;
    isCalculating.value = true;


    // gia chua giam tong san pham
    totalPriceCurrent.value = calculateTotalPriceCurrent(); 

    // gia giam tong san pham
    orderPriceDiscount.value = calculateOrderPriceDiscount(); 

    // Ưu đãi thành viên theo %
    totalDiscountRateMembership.value = calculatePriceDiscountRateMembership(membershipDiscountRate || 0)

    // gia tiet kiem
    totalPriceSave.value = calculatePriceSave()
    
    //tong tien da tru price save
    totalPriceDiscount.value = calculatePriceTotalOrder()
   

    isCalculating.value = false;
  };

  return {
    calculateTotalPriceCurrent,
    handleCalcTotalPriceCurrent,
  };
};