export const isBlockedByFlashSale = (
  product: any,
  field: 'stackableWithVoucher' | 'stackableWithPromotionGift'
) => {
  if (!product.isFlashSale || !product.flashSale?.items?.length) return false

  const matchedItem = product.flashSale.items.find(
    (fs: any) =>
      fs.variantSku === null || fs.variantSku === product.sku
  )

  return matchedItem?.[field] === false
}