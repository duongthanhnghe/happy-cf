export const useCartItemHelpers = () => {

  const getFlashAppliedQty = (item: any) => {
    if (!item?.isFlashSale) return 0
    return Math.min(item.quantity ?? 0, 1)
  }

  const getNormalQty = (item: any) => {
    if (!item?.isFlashSale) return item.quantity ?? 0
    return Math.max(item.quantity - 1, 0)
  }

  const getFlashUnitPrice = (item: any, flashItem: any) => {
    if (!item.isFlashSale || !flashItem) return 0
    return flashItem.salePrice ?? 0
  }

  const getOriginalUnitPrice = (item: any, flashItem?: any) => {
    if (item.variantCombination?.priceModifier) {
      return item.variantCombination.priceModifier
    }
    return flashItem?.originalPrice ?? item.price ?? 0
  }

  const getNormalUnitPrice = (item: any) => {
    if (item.variantCombination?.priceModifier) {
      return item.variantCombination.priceModifier
    }
    return item.priceDiscounts ?? item.price ?? 0
  }

  return {
    getFlashAppliedQty,
    getNormalQty,
    getFlashUnitPrice,
    getOriginalUnitPrice,
    getNormalUnitPrice,
  }
}
