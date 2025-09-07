import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { categoriesAPI } from "@/services/categories-product.service";
import type { ProductDTO, CategoryProductDTO, CategoryWithProductsDTO } from '@/server/types/dto/product.dto'
import { useProductCategory } from '@/composables/product/useProductCategory';
import { useProductAll } from "@/composables/product/useProductAll";

export const useOrderStore = defineStore('order', () => {

  const { getListProductAll, fetchListProductAll } = useProductAll()
  
  const { getListCategory, fetchCategoryList } = useProductCategory();
  const dataListProduct = ref<ProductDTO[]|null>(null)
  const resultData = ref<CategoryWithProductsDTO[]|null>(null)

  const getListAllProduct = async () => {
    if(!getListProductAll.value) await fetchListProductAll()
    dataListProduct.value = getListProductAll.value
  }

  const mapProductsByCategory = async (categories: CategoryProductDTO[]) => {
    return await Promise.all(
      categories.map(async category => ({
        ...category,
        products: await categoriesAPI.getListByCategory(category.id),
      }))
    )
  }

  watch(getListCategory, async () => {
    if(!getListCategory.value) {
      fetchCategoryList()
      return
    }

    const mapped = await mapProductsByCategory(getListCategory.value)
    resultData.value = mapped
  }, { immediate: true })

  const getListProducts = computed(() => resultData.value)

  return {
    dataListProduct,
    resultData,
    getListAllProduct,
    getListProducts,
  }
})
