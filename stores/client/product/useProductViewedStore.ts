import { defineStore } from 'pinia'
import { useProductViewed } from '@/composables/product/useProductViewed'

export const useProductViewedStore = defineStore('ProductViewedStore', () => {

  const limit = 12

  const {
    listItems,
    loading,
    addViewedProduct,
    fetchViewedProducts,
    viewedIds
  } = useProductViewed()

  return {
    limit,
    viewedIds,
    listItems,
    loading,
    addViewedProduct,
    fetchViewedProducts
  }
})
