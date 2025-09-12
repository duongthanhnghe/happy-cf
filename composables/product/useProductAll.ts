import { ref, computed } from "vue";
import { productsAPI } from "@/services/product.service";
import type { PostProductPaginationDTO } from '@/server/types/dto/product.dto';

export const useProductAll = () => {
  
  const listProductAll = ref<PostProductPaginationDTO>();

  const fetchListProductAll = async (page: number, limit: number) => {
    try {
      const data: PostProductPaginationDTO = await productsAPI.getAll(page, limit)
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