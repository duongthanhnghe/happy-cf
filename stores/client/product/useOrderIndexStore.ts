import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { productsAPI } from "@/services/v1/product.service";
import type { CategoryProductDTO, CategoryWithProductsDTO, ProductSortType } from '@/server/types/dto/v1/product.dto'

export const useOrderStore = defineStore('order', () => {
  
  const resultData = ref<CategoryWithProductsDTO[]|null>(null)
  const limit = 12
  const filterType = ref<ProductSortType>('discount')
  const filterCategory = ref<Record<string, string>>({})

  async function load(category:CategoryWithProductsDTO , { done }: { done: (status: 'ok' | 'empty') => void }) {
    try {
      const currentPage = category.products.pagination.page
      const totalPages = category.products.pagination.totalPages

      if (currentPage >= totalPages) {
        done('empty')
        return
      }

      const nextPage = currentPage + 1
      const res = await productsAPI.getListByCategory(category.id, nextPage, limit, filterType.value)

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
  }
})
