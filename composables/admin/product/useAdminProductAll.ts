import { ref, computed } from "vue";
import { productsAPI } from "@/services/v1/admin/product.service";
import type { ProductPaginationDTO } from '@/server/types/dto/v1/product.dto';

export const useAdminProductAll = () => {
  
  const listProductAll = ref<ProductPaginationDTO>();

  const fetchListProductAll = async (page: number, limit: number, search: string, categoryId: string) => {
    try {
      const data: ProductPaginationDTO = await productsAPI.getAll(page, limit, search, categoryId)
      if(data.code === 0) listProductAll.value = data
    } catch (err) {
      console.error('Error product all', err)
    }
  }

  const getListProductAll = computed(() => listProductAll.value);

  return {
    listProductAll,
    fetchListProductAll,
    getListProductAll
  }
}