import { useTopFlashSaleProducts } from "@/composables/product/flash-sale/useTopFlashSaleProducts";
import { defineStore } from "pinia";
import { computed } from "vue";

export const useProductTopFlashSaleStore = defineStore("ProductTopFlashSaleStore", () => {
  const { fetchTopFlashSaleProducts, getTopFlashSaleProducts, loadingData } = useTopFlashSaleProducts()

  const flashSaleProducts = computed(() =>
    getTopFlashSaleProducts.value.map(item => ({
      ...item.product,
      price: item.salePrice,
      priceDiscounts: item.salePrice,
      percentDiscount: item.maxDiscountPercent,
    }))
  )

  return {
      fetchTopFlashSaleProducts,
      getTopFlashSaleProducts,
      loadingData,
      flashSaleProducts,
  };
})
