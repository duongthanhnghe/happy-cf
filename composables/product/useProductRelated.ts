import { computed } from "vue";
import { productsAPI } from "@/services/v1/product.service";
import type { ProductDTO } from '@/server/types/dto/v1/product.dto';
import { useState } from "nuxt/app";

export const useProductRelated = () => {
  const listData = useState<ProductDTO[] | []>('product-related', () => [])

  const fetchProductRelated = async (slug: string, limit: number) => {
    try {
      const data = await productsAPI.getRelatedBySlug(slug,limit)
      if(data.code === 0) listData.value = data.data;
    } catch (err) {
      console.error('Error product detail', err)
    }
  }

  const getListProductRelated = computed(() => listData.value);

  return {
    fetchProductRelated,
    getListProductRelated
  }
}