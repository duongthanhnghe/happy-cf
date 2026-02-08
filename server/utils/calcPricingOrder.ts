import type { CartItems } from "../models/v1/order.entity";

interface PricingInput {
  cartItems: CartItems[];
  shippingFee: number;
  membershipDiscountRate: number;
  discountVoucher: number;
  discountVoucherFreeship: number;
  usedPoint: number;
  enableUsePoint: boolean;
}

export const calcPricingOrder = ({
  cartItems,
  shippingFee,
  membershipDiscountRate,
  discountVoucher,
  discountVoucherFreeship,
  usedPoint,
  enableUsePoint,
}: PricingInput) => {

  const totalPriceCurrent = cartItems.reduce((total, item) => {
    const basePrice =
      item.variantCombination?.priceModifier ??
      item.originalPrice ??
      item.price ??
      0;

    return total + basePrice * item.quantity;
  }, 0);

  let flashDiscountMax = 0;
  let normalDiscountSum = 0;

  for (const item of cartItems) {
    const basePrice =
      item.variantCombination?.priceModifier ??
      item.originalPrice ??
      0;

    const sellPrice = item.price ?? basePrice;

    // FLASH SALE
    if (
      item.isFlashSale &&
      item.originalPrice &&
      item.salePrice &&
      item.originalPrice > item.salePrice
    ) {
      flashDiscountMax = Math.max(
        flashDiscountMax,
        item.originalPrice - item.salePrice
      );
      continue;
    }

    // SẢN PHẨM THƯỜNG
    if (!item.isFlashSale && basePrice > sellPrice) {
      normalDiscountSum +=
        (basePrice - sellPrice) * item.quantity;
    }
  }

  const totalDiscountOrder =
    flashDiscountMax > 0
      ? flashDiscountMax
      : normalDiscountSum;

  let membershipDiscountAmount = 0;
  if (membershipDiscountRate > 0) {
    membershipDiscountAmount = Math.round(
      totalPriceCurrent * (membershipDiscountRate / 100)
    );
  }

  let totalPriceSave =
    totalDiscountOrder +
    membershipDiscountAmount +
    discountVoucher +
    discountVoucherFreeship;

  if (enableUsePoint && usedPoint > 0) {
    totalPriceSave += usedPoint;
  }

  let totalPrice =
    totalPriceCurrent +
    shippingFee -
    totalPriceSave;

  if (totalPrice <= 0 || Number.isNaN(totalPrice)) {
    totalPrice = 0;
  }

  return {
    totalPriceCurrent,
    totalDiscountOrder,
    totalPriceSave,
    totalPrice,
    membershipDiscountAmount,
  };
};
