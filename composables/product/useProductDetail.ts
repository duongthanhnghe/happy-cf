import { computed } from "vue";
import { productsAPI } from "@/services/product.service";
import type { ProductDTO } from '@/server/types/dto/product.dto';
import { useState } from "nuxt/app";

export const useProductDetail = () => {
  const detailProduct = useState<ProductDTO | null>('product-detail', () => null)

  const fetchDetailProduct = async (id: string) => {
    try {
      const data = await productsAPI.getDetail(id)
      if(data.code === 0) {
        detailProduct.value = data.data;
        return data
      }
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