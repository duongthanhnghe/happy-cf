import { computed, ref } from "vue";
import { productsAPI } from "@/services/v1/product.service";
import type { ProductDTO } from "@/server/types/dto/v1/product.dto";
import { useState } from "nuxt/app";

export const useProductCartDetail = () => {
  
  const cartProducts = useState<ProductDTO[]>('cart-products', () => [])
  const loadingData = ref<boolean>(false)

  const fetchCartProducts = async (ids: string[]) => {
    if (!ids.length) return { code: 1, message: "Không có sản phẩm nào trong giỏ hàng" }

    loadingData.value = true
    try {
      const data = await productsAPI.getCartProducts(ids)
      if (data.code === 0 && Array.isArray(data.data)) {
        cartProducts.value = data.data
      }
      return data
    } catch (err) {
      console.error("Error fetching cart products:", err)
      return { code: 1, message: "Lỗi khi tải sản phẩm giỏ hàng" }
    } finally {
      loadingData.value = false
    }
  }

  const getCartProducts = computed(() => cartProducts.value)

  return {
    fetchCartProducts,
    getCartProducts,
    loadingData,
  }
}
