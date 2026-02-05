import type { ProductDTO } from '@/server/types/dto/v1/product.dto'

export const useProductPriceHelpers = () => {

  const getMinPriceVariant = (product: ProductDTO) => {
    if (!product.variantCombinations?.length) return null

    const validVariants = product.variantCombinations.filter(
      v => v.inStock && v.stock && v.stock > 0
    )

    if (!validVariants.length) return null

    return validVariants.reduce((min, cur) =>
      cur.priceModifier < min.priceModifier ? cur : min
    )
  }

  const getMinVariantPrice = (product: ProductDTO) => {
    return getMinPriceVariant(product)?.priceModifier ?? null
  }

  const getDisplayPrice = (product: ProductDTO) => {
    // FLASH SALE
    if (product.isFlashSale && product.flashSale?.items?.length) {
      const best = product.flashSale.items.reduce((max, cur) =>
        cur.percentDiscount > max.percentDiscount ? cur : max
      )
      return best.salePrice
    }

    // VARIANT (không flash)
    const minVariantPrice = getMinVariantPrice(product)
    if (minVariantPrice !== null) {
      return minVariantPrice
    }

    // NORMAL PRODUCT
    return product.priceDiscounts ?? product.price
  }

  const getOriginalPrice = (product: ProductDTO) => {
    // FLASH SALE
    if (product.isFlashSale && product.flashSale?.items?.length) {
      const best = product.flashSale.items.reduce((max, cur) =>
        cur.percentDiscount > max.percentDiscount ? cur : max
      )
      return best.originalPrice
    }

    // VARIANT
    const minVariantPrice = getMinVariantPrice(product)
    if (minVariantPrice !== null) {
      return product.price
    }

    return product.price
  }

  const getPercentDiscount = (product: ProductDTO) => {
    if (product.isFlashSale && product.flashSale?.items?.length) {
      return Math.max(
        ...product.flashSale.items.map(i => i.percentDiscount)
      )
    }

    return product.percentDiscount ?? 0
  }

  const getFlashSaleVariant = (product: ProductDTO) => {
    if (!product.isFlashSale || !product.flashSale?.items?.length) {
      return null
    }

    const bestFlashItem = product.flashSale.items.reduce((max, cur) =>
      cur.percentDiscount > max.percentDiscount ? cur : max
    )

    const variant = product.variantCombinations?.find(
      v => v.sku === bestFlashItem.variantSku
    )

    if (!variant) return null

    return {
      variant,
      flashItem: bestFlashItem,
    }
  }


  return {
    getDisplayPrice,
    getOriginalPrice,
    getPercentDiscount,
    getMinPriceVariant,
    getFlashSaleVariant,
  }
}
