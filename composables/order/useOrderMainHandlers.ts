import { watchEffect, ref } from 'vue';
export const useOrderMainHandlers = async (
  storeProductMostOrder: any,
  storeProductSale: any,
  storeProductCategory: any,
) => {

  const tab = ref<number|null>(null)
  const tabs = [
    { value: 1, icon: 'category', label: 'Nổi bật' },
    { value: 2, icon: 'local_fire_department', label: 'Bán chạy' },
    { value: 3, icon: 'percent', label: 'Khuyến mãi' },
  ]

  await storeProductCategory.fetchCategoryStore()

  watchEffect(async() => {
    if (tab.value === 2 && !storeProductMostOrder.getListProductMostOrder) await storeProductMostOrder.fetchListProductMostOrder('',storeProductMostOrder.page,storeProductMostOrder.limit,'')
    if (tab.value === 3 && !storeProductSale.getListProductSales) await storeProductSale.fetchListProductSales('',storeProductSale.page,storeProductSale.limit,'')
  })

  return {
    tab,
    tabs,
  };
};