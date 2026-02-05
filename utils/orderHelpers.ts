import type { cartItems } from '@/server/types/dto/v1/order.dto';

export const useOrderHelpers = () => {

  const remainingProductNames = (cartItems: cartItems[]) => {
    if (!cartItems) return "";

    return cartItems
      .slice(2)
      .map(item => {
        const name = typeof item.idProduct === "string"
          ? item.idProduct
          : item.idProduct.productName;
        return ` ${name},`;
      })
      .join("");
  }

  const getFlashAppliedQty = (item: any) => {
    if (!item?.isFlashSale) return 0
    return Math.min(item.quantity ?? 0, 1)
  }

  const getNormalQty = (item: any) => {
    if (!item?.isFlashSale) return item.quantity ?? 0
    return Math.max((item.quantity ?? 0) - 1, 0)
  }

  const getOriginalUnitPrice = (item: any) => {
    if (item.variantCombination?.priceModifier) {
      return item.variantCombination.priceModifier
    }
    return item.originalPrice ?? 0
  }

  const getFlashUnitPrice = (item: any) => {
    if (!item.isFlashSale) return 0
    return item.salePrice ?? 0
  }

  const getNormalUnitPrice = (item: any) => {
    if (item.variantCombination?.priceModifier) {
      return item.variantCombination.priceModifier
    }

    if (item.priceDiscount && item.priceDiscount > 0) {
      return item.priceDiscount
    }

    return item.originalPrice ?? 0
  }

  return { 
    remainingProductNames,
    getFlashAppliedQty,
    getNormalQty,
    getOriginalUnitPrice,
    getFlashUnitPrice,
    getNormalUnitPrice,
   }
}
