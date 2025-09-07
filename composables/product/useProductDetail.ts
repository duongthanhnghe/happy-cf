import { ref, computed } from "vue";
import { productsAPI } from "@/services/product.service";
import type { ProductDTO } from '@/server/types/dto/product.dto';

export const useProductDetail = () => {
  const detailProduct = ref<ProductDTO|null>(null);

  const fetchDetailProduct = async (id: string) => {
    try {
      const data = await productsAPI.getDetail(id)
      if(data.code === 0) detailProduct.value = data.data;
    } catch (err) {
      console.error('Error product detail', err)
    }
  }

  const getDetailProduct = computed(() => detailProduct.value);

  return {
    detailProduct,
    fetchDetailProduct,
    getDetailProduct
  }
}