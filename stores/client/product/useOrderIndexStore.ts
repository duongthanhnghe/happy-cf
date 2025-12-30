import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { productsAPI } from "@/services/v1/product.service";
import type { CategoryProductDTO, CategoryWithProductsDTO, ProductPaginationDTO, ProductSortType } from '@/server/types/dto/v1/product.dto'

export const useOrderStore = defineStore('order', () => {
  
  const resultData = ref<CategoryWithProductsDTO[]|null>(null)
  const limit = 12
  const filterType = ref<ProductSortType>('') // moi nhat
  const filterCategory = ref<Record<string, string>>({})
  const loadingMore = ref<Record<string, boolean>>({})

  async function load(category: CategoryWithProductsDTO, { done }: { done: (status: 'ok' | 'empty') => void } ) {
    try {
      loadingMore.value[category.id] = true

      const pagination = category.products.pagination
      const loadedCount = category.products.data.length
      const totalItems = pagination.total

      if (loadedCount >= totalItems) {
        done('empty')
        return
      }

      const nextPage = pagination.page + 1

      const res = await productsAPI.getListByCategory(
        category.id,
        nextPage,
        limit,
        filterType.value
      )

      if (res.data?.length) {
        category.products.data.push(...res.data)
        category.products.pagination = res.pagination
        done('ok')
      } else {
        done('empty')
      }
    } catch (err) {
      console.error(err)
      done('empty')
    } finally {
      loadingMore.value[category.id] = false
  }
  }

  const mapProductsByCategory = async (categories: CategoryProductDTO[]) => {
    const mapped = await Promise.all(
      categories.map(async category => {
        const products = await productsAPI.getListByCategory(category.id,1,limit,filterType.value)
          if (category.id) {
            filterCategory.value[category.id] = category.id
          }

        return {
          ...category,
          products,
        }
      })
    )
    
    return mapped
  }

  const getListProducts = computed(() => resultData.value)
 
  return {
    resultData,
    load,
    mapProductsByCategory,
    getListProducts,
    filterCategory,
    loadingMore,
  }
})
