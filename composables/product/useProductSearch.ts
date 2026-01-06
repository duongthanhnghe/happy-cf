import { ref, computed } from "vue";
import { productsAPI } from "@/services/v1/product.service";
import type { ProductPaginationDTO } from '@/server/types/dto/v1/product.dto';

export const useProductSearch = () => {
  
  const listData = ref<ProductPaginationDTO|null>(null)
  const loading = ref(false)

  const fetchListProductSearch = async (keyword: string, page: number, limit: number) => {
    loading.value = true;
    try {
      const data: ProductPaginationDTO = await productsAPI.search(keyword, page, limit)
      if(data.code === 0) {
        listData.value = data
      }
    } catch (err) {
      console.error('Error product all', err)
    } finally {
      loading.value = false;
    }
  }

  const getListProductSearch = computed(() => listData.value);

  return {
    fetchListProductSearch,
    getListProductSearch,
    loading
  }
}