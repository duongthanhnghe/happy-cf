import { ref } from 'vue'
import { productsAPI } from '@/services/v1/product.service'
import type { ProductDTO } from '@/server/types/dto/v1/product.dto'

const MAX_VIEWED = 12

export const useProductViewed = () => {
 
  const viewedIds = useCookie<string[]>('product_viewed_ids', {
    default: () => [],
    maxAge: 60 * 60 * 24 * 30, // 30 ngày
    sameSite: 'lax'
  })

  const listItems = ref<ProductDTO[]>([])
  const loading = ref(false)

  const addViewedProduct = (productId: string) => {
    if (!productId) return

    const current: string[] = viewedIds.value || []

    viewedIds.value = [
      productId,
      ...current.filter(id => id !== productId)
    ].slice(0, MAX_VIEWED)
  }

  const fetchViewedProducts = async (limit: number) => {
    if (!viewedIds.value?.length) {
      listItems.value = []
      return
    }

    loading.value = true
    try {
      const ids: string[] = viewedIds.value.slice(0, limit)

      const res = await productsAPI.getProductsByIds(ids, limit)
      if (res.code === 0) {
        listItems.value = ids
          .map(id => res.data.find(p => p.id === id))
          .filter(Boolean) as ProductDTO[]
      }
    } catch (err) {
      console.error('fetchViewedProducts error:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    viewedIds,
    listItems,
    loading,
    addViewedProduct,
    fetchViewedProducts
  }
}
