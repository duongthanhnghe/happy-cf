import { watchEffect, ref } from 'vue';
export const useOrderMainHandlers = async (
  storeProductMostOrder: any,
  storeProductSale: any,
  storeProductCategory: any,
) => {

  const tab = ref<number|null>(null)
  const tabs = [
    { value: 1, icon: 'category', label: 'Menu' },
    { value: 2, icon: 'local_fire_department', label: 'Bán chạy' },
    { value: 3, icon: 'percent', label: 'Khuyến mãi' },
  ]

  await storeProductCategory.fetchCategoryStore()

  watchEffect(() => {
    if (tab.value === 2) storeProductMostOrder.fetchProductStore()
    if (tab.value === 3) storeProductSale.fetchProductStore()
  })

  return {
    tab,
    tabs,
  };
};