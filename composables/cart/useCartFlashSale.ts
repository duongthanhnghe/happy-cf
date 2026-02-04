import { computed, type Ref } from 'vue'
import type { CartDTO } from '@/server/types/dto/v1/product.dto'

export const useCartFlashSale = (
  cartListItem: Ref<CartDTO[]>,
) => {

  const isBlockedByFlashSale = (
    item: CartDTO,
    field: 'stackableWithPromotionGift' | 'stackableWithVoucher'
  ) => {
    if (!item.isFlashSale || !item.flashSale?.items?.length) return false

    const matched = item.flashSale.items.find(fs =>
      fs.variantSku === null || fs.variantSku === item.sku
    )

    return matched?.[field] === false
  }

  const blockedGiftByFlashSale = computed(() =>
    cartListItem.value.some(item =>
      isBlockedByFlashSale(item, 'stackableWithPromotionGift')
    )
  )

  const blockedVoucherByFlashSale = computed(() =>
    cartListItem.value.some(item =>
      isBlockedByFlashSale(item, 'stackableWithVoucher')
    )
  )

  return {
    blockedGiftByFlashSale,
    blockedVoucherByFlashSale,
  }
}
