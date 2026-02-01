import { useTopFlashSaleProducts } from "@/composables/product/flash-sale/useTopFlashSaleProducts";
import { defineStore } from "pinia";

export const useProductTopFlashSaleStore = defineStore("ProductTopFlashSaleStore", () => {
  const { fetchTopFlashSaleProducts, getTopFlashSaleProducts, loadingData } = useTopFlashSaleProducts()

  return {
      fetchTopFlashSaleProducts,
      getTopFlashSaleProducts,
      loadingData,
  };
})
