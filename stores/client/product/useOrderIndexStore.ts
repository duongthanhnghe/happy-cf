import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { categoriesAPI } from "@/services/categories-product.service";
import type { CategoryProductDTO, CategoryWithProductsDTO, ProductSortType } from '@/server/types/dto/product.dto'

export const useOrderStore = defineStore('order', () => {
  const resultData = ref<CategoryWithProductsDTO[]|null>(null)
  const limit = 20
  const filterType = ref<ProductSortType>('discount')

  async function load(category:CategoryWithProductsDTO , { done }: { done: (status: 'ok' | 'empty') => void }) {
    try {
      const currentPage = category.products.pagination.page
      const totalPages = category.products.pagination.totalPages

      if (currentPage >= totalPages) {
        done('empty')
        return
      }

      const nextPage = currentPage + 1
      const res = await categoriesAPI.getListByCategory(category.id, nextPage, limit, filterType.value)

      if (res.data && res.data.length > 0) {
        category.products.data.push(...res.data)
        category.products.pagination = res.pagination
        done('ok')
      } else {
        done('empty')
      }
    } catch (err) {
      console.error('Error loading more products:', err)
      done('empty')
    }
  }

  const mapProductsByCategory = async (categories: CategoryProductDTO[]) => {
    return await Promise.all(
      categories.map(async category => ({
        ...category,
        products: await categoriesAPI.getListByCategory(category.id, 1, limit, filterType.value),
      }))
    )
  }

  const getListProducts = computed(() => resultData.value)

  return {
    resultData,
    load,
    mapProductsByCategory,
    getListProducts,
  }
})
