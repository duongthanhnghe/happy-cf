import { ref, computed } from "vue";
import { productsAPI } from "@/services/product.service";
import type { ProductDTO } from '@/server/types/dto/product.dto';

export const useProductAll = () => {
  const listProductAll = ref<ProductDTO[]|null>(null);

  const fetchListProductAll = async () => {
    try {
      const data = await productsAPI.getAll()
      if(data.code === 0) listProductAll.value = data.data
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