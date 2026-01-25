import { computed, type Ref } from 'vue'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useProductCheckStock } from '@/composables/product/useProductCheckStock'
import { showWarning } from '@/utils/toast'
import type {
  PromotionGiftItemDTO,
  AvailablePromotionGiftDTO,
} from '@/server/types/dto/v1/promotion-gift.dto'
import type { ProductDTO } from '@/server/types/dto/v1/product.dto'

export const usePromotionGiftCart = (
  items: Ref<AvailablePromotionGiftDTO[]>
) => {
  const cartStore = useCartStore()
  const { checkStock, availableStock } = useProductCheckStock()

  const isLockedPromo = (promoId: string) => {
    if (cartStore.giftItems.length === 0) return false

    return !cartStore.giftItems.some(
      gift => gift.promotionId === promoId
    )
  }

  const isSelectedPromo = (promoId: string) => {
    return cartStore.giftItems.some(
      gift => gift.promotionId === promoId
    )
  }

  const giftPromotions = computed(() => {
    if (!items.value?.length) return []

    return items.value
      .map(promo => {
        const gifts = promo.gifts.filter(
          (g): g is PromotionGiftItemDTO & { product: ProductDTO } =>
            !!g.product
        )

        if (!gifts.length) return null

        return {
          id: promo.id,
          name: promo.name,
          gifts,
          locked: promo.locked,
          message: promo.message,
          missingAmount: promo.missingAmount,
        }
      })
      .filter(Boolean)
  })

  const handleGiftVariantChange = ({
    productId,
    combinationId,
  }: {
    productId: string
    combinationId?: string
  }) => {
    cartStore.setPendingGiftVariant(productId, combinationId)
  }

  const handleSelectGift = async (
    promoId: string,
    gifts: PromotionGiftItemDTO[]
  ) => {
    if (cartStore.giftItems.length > 0) return

    const payload = []

    for (const gift of gifts) {
      if (!gift.product) return

      await checkStock({
        productId: gift.product.id,
        quantity: gift.quantity,
      })

      if (!availableStock.value || availableStock.value < gift.quantity) {
        showWarning(`Quà "${gift.product.productName}" đã hết hàng`)
        return
      }

      if (
        gift.product.variantCombinations?.length &&
        !cartStore.pendingGiftVariants[gift.product.id]
      ) {
        showWarning(`Vui lòng chọn biến thể cho "${gift.product.productName}"`)
        return
      }

      payload.push({
        productId: gift.product.id,
        quantity: gift.quantity,
        combinationId:
          cartStore.pendingGiftVariants[gift.product.id] ?? undefined,
      })
    }

    cartStore.setGiftItems(promoId, payload)
  }

  return {
    giftPromotions,
    isLockedPromo,
    isSelectedPromo,
    handleGiftVariantChange,
    handleSelectGift,
  }
}
