import { ref, computed } from "vue";
import { productsAPI } from "@/services/v1/product.service";
import type { ProductDTO } from '@/server/types/dto/v1/product.dto';

export const useProductSales = () => {
  const listProductSales = ref<ProductDTO[]|[]>([]);
  const limitProductSales = ref<number>(10);

  const fetchListProductSales = async () => {
    try {
      const data = await productsAPI.getPromotional(limitProductSales.value)
      if(data.code === 0) {
        listProductSales.value = data.data
      }
    } catch (err) {
      console.error('Error most order', err)
    }
  }

  const getListProductSales = computed(() => listProductSales.value);

  return {
    listProductSales,
    limitProductSales,
    fetchListProductSales,
    getListProductSales
  }
}