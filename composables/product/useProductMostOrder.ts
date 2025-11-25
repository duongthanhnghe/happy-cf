import { ref, computed } from "vue";
import { productsAPI } from "@/services/v1/product.service";
import type { ProductDTO } from '@/server/types/dto/v1/product.dto';

export const useProductMostOrder = () => {
  const listProductMostOrder = ref<ProductDTO[]>([]);
  const limitProductMostOrder = ref<number>(12);
  const loading = ref(false)

  const fetchListProductMostOrder = async () => {
    loading.value = true
    try {
      const data = await productsAPI.getMostOrdered(limitProductMostOrder.value)
      if(data.code === 0) {
        listProductMostOrder.value = data.data
        return data
      }
    } catch (err) {
      console.error('Error most order', err)
    } finally {
      loading.value = false
    }
  }

  const getListProductMostOrder = computed(() => listProductMostOrder.value);

  return {
    listProductMostOrder,
    limitProductMostOrder,
    fetchListProductMostOrder,
    getListProductMostOrder,
    loading
  }
}