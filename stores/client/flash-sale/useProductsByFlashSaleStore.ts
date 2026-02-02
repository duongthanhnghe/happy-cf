import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import type { ProductPaginationDTO } from '@/server/types/dto/v1/product.dto'
import { useProductsByFlashSale } from "@/composables/product/flash-sale/useProductsByFlashSale";
import { useProductsByFlashSaleOperation } from "@/composables/product/flash-sale/useProductsByFlashSaleOperation";

export const useProductsByFlashSaleStore = defineStore("ProductsByFlashSaleStore", () => {

  const { getProductsByFlashSale, fetchProductsByFlashSale, loadingData } = useProductsByFlashSale()

  const limit = 12
  const items = ref<ProductPaginationDTO|null>(null)
  const flashSaleId = ref<string|null>(null)

  const utils = useProductsByFlashSaleOperation(
    limit,
    items,
    flashSaleId,
    getProductsByFlashSale,
    fetchProductsByFlashSale,
  );

  const getListProductResult = computed(() => items.value)

  const fetchInit = async (id: string) => {
    if (!id) return

    await fetchProductsByFlashSale(id, 1, limit)
    items.value = getProductsByFlashSale.value
  }

  return {
    limit,
    items,
    flashSaleId,
    ...utils,
    getListProductResult,
    fetchInit,
    loadingData,
    getProductsByFlashSale,
    fetchProductsByFlashSale,
  };
});
