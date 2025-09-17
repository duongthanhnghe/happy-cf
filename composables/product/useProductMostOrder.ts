import { ref, computed } from "vue";
import { productsAPI } from "@/services/product.service";
import type { ProductDTO } from '@/server/types/dto/product.dto';

export const useProductMostOrder = () => {
  const listProductMostOrder = ref<ProductDTO[]>([]);
  const limitProductMostOrder = ref<number>(10);

  const fetchListProductMostOrder = async () => {
    try {
      const data = await productsAPI.getMostOrdered(limitProductMostOrder.value)
      if(data.code === 0) {
        listProductMostOrder.value = data.data
        return data
      }
    } catch (err) {
      console.error('Error most order', err)
    }
  }

  const getListProductMostOrder = computed(() => listProductMostOrder.value);

  return {
    listProductMostOrder,
    limitProductMostOrder,
    fetchListProductMostOrder,
    getListProductMostOrder
  }
}