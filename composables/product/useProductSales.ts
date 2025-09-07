import { ref, computed } from "vue";
import { productsAPI } from "@/services/product.service";
import type { ProductDTO } from '@/server/types/dto/product.dto';

export const useProductSales = () => {
  const listProductSales = ref<ProductDTO[]|null>(null);
  const limitProductSales = ref<number>(10);

  const fetchListProductSales = async () => {
    try {
      const data = await productsAPI.getAll()
      if(data.code === 0) {
        listProductSales.value = data.data.filter((product: ProductDTO) =>
          product.priceDiscounts !== null &&
          product.price !== null &&
          product.amount !== null &&
          product.priceDiscounts < product.price &&
          product.amount > 0
        ).slice(0, limitProductSales.value)
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